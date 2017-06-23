class Mobile {
    constructor() {
        // 모바일 대응 Js
        this.isMobile = false;

        let mobileInfo = new Array('Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry', 'Windows CE', 'SAMSUNG', 'LG', 'MOT', 'SonyEricsson');
        for (let info in mobileInfo) {
            if (navigator.userAgent.match(mobileInfo[info]) != null) {
                this.isMobile = true;
                break;
            }
        }

        // 테이블 헤드 제거됨
        // let tableFloor = document.querySelectorAll('table th:first-child span');
        // if (this.isMobile) {
        //   tableFloor[0].classList.add('hidden');
        //   tableFloor[2].classList.add('hidden');
        //   tableFloor[1].classList.remove('hidden');
        //   tableFloor[3].classList.remove('hidden');
        // }
    }

    notification(title, body) {
        const options = {
            body: body,
            icon: '../images/icon.png',
            badge: '../images/badge.png'
        };
        Push.create(title, options);
    }
}


const mobile = new Mobile();
