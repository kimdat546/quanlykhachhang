/**
 * @description bộ phận ở lại quyền xem
 */

export const listRole_stayAtHome_see = {
	employee: [
		{
			value: "system",
			description: "Xem lao động hệ thống quyền admin",
		},
		{
			value: "yourself",
			description: "Xem lao động tài khoản chính mình",
		},
		{
			value: "systemNotAdmin",
			description: "Xem lao động tất cả ngoại trừ admin",
		},
	],
	customer: [
		{
			value: "system",
			description: "Xem khách hàng hệ thống quyền admin",
		},
		{
			value: "yourself",
			description: "Xem khách hàng tài khoản chính mình",
		},
		{
			value: "systemNotAdmin",
			description: "Xem khách hàng tất cả ngoại trừ admin",
		},
	],
};
