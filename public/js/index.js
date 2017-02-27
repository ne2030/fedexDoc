class FedexDoc {
    constructor() {
        // Define cache
        this.cache = {
            today: undefined,
            tomorrow: undefined,
        };

        // HTLM elements
        this.inputs = document.getElementsByTagName('input');
        this.selects = document.querySelectorAll('.select');
        this.submit_btn = document.getElementById('submit_btn');
        this.btn_manage = document.getElementById('btn-manage');
        this.btn_add = document.getElementById('btn-add');
        let form = document.getElementById('form');

        let getDateForm = this.getDateForm;

        // date
        this.today = {
            dateForm: getDateForm(),
            date: 'today',
            container: document.getElementById('today_contents'),
            manage: document.getElementById('manage_today')
        };

        this.tomorrow = {
            dateForm: getDateForm('tomorrow'),
            date: 'tomorrow',
            container: document.getElementById('tomorrow_contents'),
            manage: document.getElementById('manage_tomorrow')
        };



        this.btn_manage.addEventListener('click', () => {
            if (auth.isAuthenticate()) {
                this.manageDelivery();
            } else {
                auth.authenticate().then(
                    () => {
                        auth.isAuthenticate() ?
                            this.manageDelivery() : alert('인증된 관리자가 아닙니다');
                    });
            }
        });

        if (mobile.isMobile) form.classList.add('hidden');
        this.btn_add.addEventListener('click', () => {
            form.classList.toggle('hidden');
        });


        this.getDeliveryList(this.today);
        this.getDeliveryList(this.tomorrow);

        this.connectSubmit();
    }

    getDateForm(isTomorrow) {
        let time = new Date();
        if (isTomorrow) {
            if (/Fri/.test(time)) { time.setDate(time.getDate() + 3);}
            else { time.setDate(time.getDate() + 1); }
        }
        return `${time.getFullYear()} - ${time.getMonth() + 1} - ${time.getDate()}`;
    }

    getDeliveryList(day) {
        firebase.database().ref(`doc/${day.dateForm}`).on('value', (data) => {
            if (data.val()) {
                this.filteringCache(data.val(), day.date);
                console.log('receive data: ' + this.cache.today, this.cache.tomorrow);
                this.showList(day);
                if (mobile.isMobile && auth.isAuthenticate()) this.spreadPushList();
            } else if (this.cache[day.date]) {
                this.cache[day.date] = undefined;
                day.container.innerHTML = '';
                let empty = document.createElement('tr');
                empty.innerHTML = `<tr>
          <td colspan="5"> 할 일이 없습니다!! </td>
        </tr>`;
                day.container.appendChild(empty);
            }
        });
    }

    showList(day) {
        day.container.innerHTML = '';
        this.cache[day.date].map(work => {
            let row = document.createElement('tr');
            let isComplete = work['완료'] == 'o';
            let isRecieve = work['타입'] == 'recieve' ? 'warning' : 'send';
            row.classList.add('delivery', isRecieve);
            row.innerHTML = `
          <td> ${work['위치']} </td>
          <td> ${work['장소']} </td>
          <td> ${work['사람']} </td>
          <td> ${auth.isAuthenticate ? work['내용'] : 'secret'} </td>
          <td> <div id=${work.key} day=${day.date} class="btn ${isComplete ? 'btn-success' : 'btn-danger'} btn-xs"> ${isComplete ? '완료' : '미완' } </div> </td>
      `;
            day.container.appendChild(row);
        });
        day.container.addEventListener('click', (e) => {
            console.log(e);
            let btn = e.target;
            if(!btn || !btn.classList || !btn.classList.contains('btn')) { return; }

            let day = btn.getAttribute('day') == 'today' ? this.today.dateForm : this.tomorrow.dateForm;
            if (auth.isAuthenticate()) {
                firebase.database().ref(`/doc/${day}/${btn.id}`).update({
                    '완료': 'o'
                });
            } else {
                alert('목록 관리 권한이 없습니다.');
            }
        });
    }

    connectSubmit() {
        this.submit_btn.addEventListener('click', () => {
            this.postDelivery();
        });
        for (let el of this.inputs) {
            el.addEventListener('keydown', e => {
                if (e.keyCode == 13) this.postDelivery();
            });
        }
        for (let el of this.selects) {
            el.addEventListener('keydown', e => {
                if (e.keyCode == 13) this.postDelivery();
            });
        }
    }

    postDelivery() {
        let postDate = this.selects[1].value == 'today' ? this.today.dateForm : this.tomorrow.dateForm;
        let inputs = this.inputs;
        // Input empty check
        if ((inputs[0].value == '') || (inputs[1].value == '')) {
            return alert('장소나 사람을 확실히 입력해 주십시오');
        }
        let floor = this.whichFloor(inputs[0].value),
            department = inputs[0].value,
            whois = inputs[1].value,
            content = inputs[2].value == '' ? '생략' : inputs[2].value,
            type = this.selects[0].value;
        inputs[0].value = inputs[1].value = inputs[2].value = '';
        firebase.database().ref(`doc/${postDate}`).push({
            '위치': floor,
            '장소': department,
            '사람': whois,
            '내용': content,
            '완료': 'x',
            '타입': type
        });
    }

    whichFloor(department) {
        let res;
        let floors = [
            '사회보장과 장애인지원과 민원여권과 부동산정보과',
            '재무과 세무과 교육지원과 평생학습과 정신보건센터',
            '감사담당관 공동주택지원과 주택사업과 도시관리과 건축과 일자리경제과 공원녹지과',
            '기획재정국장실 교육복지국장실 도시계획국장실 교통환경국장실 공무원노조 기획예산과 복지정책과 디지털홍보과 물안전관리과 ICT지원센터',
            '구청장실 부구청장실 행정지원과 기획상황실 어르신복지과',
            '자치행정과 문화과 여성가족과 녹색환경과 자원순환과 체육청소년과',
            '노원구의회',
            '의회사무국',
            '교통행정과 토목과 교통지도과 건설관리과 자동차민원실 생활건강과 보건위생과'
        ];
        floors.map(floor => {
            if (floor.match(department)) {
                res = floors.indexOf(floor) == 8 ? '0' : floors.indexOf(floor) + 1;
            }
        });
        return res || -1;
    }

    manageDelivery() {
        try {
            let container = document.getElementById('basic_container'),
                manageContainer = document.getElementById('manage_container');

            if (container.classList.contains('hidden')) {
                manageContainer.classList.toggle('hidden');
                container.classList.toggle('hidden');
                return;
            }

            // Clear initial list state
            this.today.manage.innerHTML = '';
            this.tomorrow.manage.innerHTML = '';

            // Spread removable work list
            if (this.cache['today']) this.deleteList(this.today);
            if (this.cache['tomorrow']) this.deleteList(this.today);

            // Different method PC && mobile
            if (mobile.isMobile) {
                // Remove delivery by swiping
                Swiped.init({
                    query: '.removable',
                    duration: 700,
                    left: 1200,
                    right: 1200,
                    onOpen: function(node) {
                        this.destroy(true);
                        let date = node.getAttribute('date');
                        firebase.database().ref(`/doc/${date}/${node.id}`).remove();
                    }
                });
            } else {
                let list = document.querySelectorAll('.removable-pc');
                for (let work of list) {
                    work.addEventListener('click', () => {
                        let date = work.getAttribute('date');
                        firebase.database().ref(`/doc/${date}/${work.id}`).remove();
                        work.parentNode.removeChild(work);
                    });
                }
            }

            // Change container view
            container.classList.toggle('hidden');
            manageContainer.classList.toggle('hidden');
        } catch (e) {
            alert(e);
        }
    }

    filteringCache(datas, date) {
        let res = [];
        for (let key in datas) {
            res.push(Object.assign({}, datas[key], { key }));
        }

        res.sort((a, b) => {
            let floorA = parseInt(a['위치']),
                floorB = parseInt(b['위치']);
            if (floorA < floorB) return 1;
            else if (floorA > floorB) return -1;
            return a['장소'] > b['장소'] ? 1 : -1;
        });



        this.cache[date] = res;
        return;
    }

    deleteList(day) {
        this.cache[day.date].map(work => {
            let item = document.createElement('div'),
                className = mobile.isMobile ? 'removable' : 'removable-pc';
            item.classList.add(className);
            item.setAttribute('id', work.key);
            item.setAttribute('date', day.dateForm);
            item.textContent = work['장소'] + '/' + work['사람'];
            day.manage.appendChild(item);
        });
    }

    spreadPushList() {
        // delete previous push
        Push.Permission.GRANTED;
        swRegistration.getNotifications().then(prevNotifications => {
            prevNotifications.map(prevNoti => prevNoti.close());
            let options;
            this.cache.today.map(work => {
                if (work['완료'] == 'o') return;
                options = {
                    body: work['내용'],
                    icon: 'images/icon.png',
                    badge: 'images/badge.png',
                    serviceWorker: '/service-worker.js',
                    data: this.today.dateForm,
                    tag: work.key
                };
                Push.create(work['장소'] + '/' + work['사람'], options);
            });
        });
    }
}

const fedexDoc = new FedexDoc();
