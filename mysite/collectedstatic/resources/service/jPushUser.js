/*
 * jPushUser.js
 * name:xiaojia 小嘉
 * email:iatt@qq.com
 * qq:273142650
 * time:2012.4.3 14:38
*/

var jPushUser = {

	data: {

		userinfo: null,
        state: 0,
        username: '',
        gamearea: ''
	},

	refresh: function () {
		this.data.userinfo = null;
	},

	userState: function () {
		return this.data.state;
	},
    
    userName: function () {
        return this.data.username;
    },
    
    setGameArea: function (str){
        this.data.gamearea = str;  
    },
    
    GameArea: function () {
        var arr = new Array;
        arr = this.data.gamearea.split('_');
        return arr[0] + '-' + arr[1];
    },
	
    userInfo: function () {
        var _this = this;
		if (this.data.userinfo != null) {
			return this.data.userinfo;
		} else {
			var _userinfo;
			$.ajax({
				type: 'POST',
				url: '/userInfo/',
				cache: false,
				async: false,
				dataType: 'json',
				success: function (datas, status) {
				    if (datas.ret == 0){
                        _userinfo = datas;
                        _this.data.state = 200;
                        _this.data.username = datas.username;
                    }
                    else{
                        alert(datas.msg);
                        window.location.href = '/logout/';
                    }
				}
			});
			this.data.userinfo = _userinfo;
			return this.data.userinfo;
		}
	}
}
