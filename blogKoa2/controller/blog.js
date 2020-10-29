
const {exec} = require('../database/mysql.js')
const xss = require('xss')

const getBlogList = async (author, keyword) => {
	let sql = `select * from blogs where 1=1`
	if (author) {
		sql += ` and author = '${author}'`
	}
	if (keyword) {
		sql += ` and title like '%${keyword}%'`
	}
	sql += ` order by createtime desc;`

	return await exec(sql)
}

const getBlogDetail = async id => {
	let sql = `select * from blogs where blogId = ${id}`
	const blogData = await exec(sql)
    return blogData[0] || {}
}

const addBlog = async (blogData = {}) => {
	// insert into blogs(title, content, createtime, author) values ('标题B', '内容B', 1599187696368, 'zhangsan')
	let {title, content, createtime, author} = blogData;
	title = xss(title)
	content = xss(content)
	let sql = `
		insert into blogs(title, content, createtime, author) values ('${title}', '${content}', ${createtime}, '${author}')
	`

    const insertResult = await exec(sql)
    return {
        blogId: insertResult.insertId
    }
}

const updateBlog = async (id, blogData = {}) => {
	// id为博客对应的id
	// blogData中包含title 和content
	title = xss(blogData.title)
	content = xss(blogData.content)

	let sql = `update blogs set title='${title}', content='${content}' where blogId=${id}`

    const updateBlogData = await exec(sql)
    return updateBlogData.affectedRows > 0
}

const deleteBlog = async id => {
	let sql = `delete from blogs where blogId=${id}`

    const deleteResult = await exec(sql)
    return deleteResult.affectedRows > 0
}

module.exports = {
	getBlogList,
	getBlogDetail,
	addBlog,
	updateBlog,
	deleteBlog
}