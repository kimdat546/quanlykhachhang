/**
 * @description format date from string
 */
function formatDate(stringDate) {
	const dateTemp = stringDate.split("/");
	const date = new Date(dateTemp[2], dateTemp[1] - 1, dateTemp[0]);
	return date.toLocaleDateString();
}

module.exports = formatDate;
