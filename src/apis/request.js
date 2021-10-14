import axios from 'axios'
import Qs from 'qs'
import { getStorage, setStorage } from '../utils';
import config from '../conf';

window.axiosCancel = [];

// 创建axios实例
export const service = axios.create({
	baseURL: config.baseURI, // api的base_url
	timeout: 240000 ,// 请求超时时间
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded',  //指定消息格式
		'Accept' : 'application/json',
	},
})

// request拦截器
service.interceptors.request.use(config => {
	let userInfo = getStorage("lv_userInfo");
	const { accessToken : token = ''} = userInfo || {};
	const machineCode = getStorage('machineCode');
	
	if (config.method === 'get' || config.headers['Content-Type']=='application/json;charset=UTF-8') {
		let params = {
			...config.params,
			token: token,
			appType: 8,
			machineCode: machineCode,
		}
		config['params'] = params;
	}
	
	if (config.method === 'post' && config.headers['Content-Type']!='application/json;charset=UTF-8') {
		let data = {
			...config.data,
			token: token,
			appType: 8,
			machineCode: machineCode,
		}
		config['data'] = data;
		config.data = Qs.stringify(config.data);
	}
	config.cancelToken = new axios.CancelToken(cancel => {
		window.axiosCancel.push({
			cancel
		})
	})
	return config
}, error => {
	// Do something with request error
	console.log(error) // for debug
	Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
	response => {
		const res = response.data;
		/**
		 * code非0是抛错
		 */
		return res
	},
	error => {
		console.log('err' + error)// for debug
		return Promise.reject(error)
	}
)

