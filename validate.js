let fs=require('fs');

module.exports=(path)=>{
	return (
		fs.existsSync(`${path}/src`) && 
		fs.existsSync(`${path}/include`) &&
		fs.existsSync(`${path}/Makefile`)
	)
}