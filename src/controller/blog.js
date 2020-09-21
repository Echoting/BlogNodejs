
const {exec} = require('../database/mysql.js')

const getBlogList = (author, keyword) => {
	let sql = `select * from blogs where 1=1`
	if (author) {
		sql += ` and author = '${author}'`
	}
	if (keyword) {
		sql += ` and title like '%${keyword}%'`
	}
	sql += ` order by createtime desc;`

	return exec(sql)
}

const getBlogDetail = id => {
	let sql = `select * from blogs where blogId = ${id}`
	return exec(sql).then(blogData => {
		return blogData[0]
	})
}

const addBlog = (blogData = {}) => {
	// insert into blogs(title, content, createtime, author) values ('标题B', '内容B', 1599187696368, 'zhangsan')
	const {title, content, createtime, author} = blogData;
	let sql = `
		insert into blogs(title, content, createtime, author) values ('${title}', '${content}', ${createtime}, '${author}')
	`
	return exec(sql).then(insertResult => {
		return {
			blogId: insertResult.insertId
		}
	})
}

const updateBlog = (id, blogData = {}) => {
	// id为博客对应的id
	// blogData中包含title 和content
	title = blogData.title
	content = blogData.content

	let sql = `update blogs set title='${title}', content='${content}' where blogId=${id}`

	return exec(sql).then(updateBlogData => {
		if (updateBlogData.affectedRows > 0) {
			return true
		}
		return false
	})
}

const deleteBlog = id => {
	let sql = `delete from blogs where blogId=${id}`
	return exec(sql).then(deleteResult => {

		if (deleteResult.affectedRows > 0) {
			return true
		}
		return false
	})
}

module.exports = {
	getBlogList,
	getBlogDetail,
	addBlog,
	updateBlog,
	deleteBlog
}