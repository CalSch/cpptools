#!/usr/bin/env node
const { Command } = require('commander');
const fs=require('fs');
const ejs=require('ejs');
const validate=require('./validate');
const app=new Command();


app
.name("Calvin's C++ Project Tools")
.version('1.0.0');

// fs.readdirSync(`${__dirname}/commands`).forEach((file)=>{
// 	if (!file.endsWith('js')) return;
// 	let cmd=require(`${__dirname}/commands/${file}`);
// 	let command=app
// 	.command(cmd.str)
// 	.description(cmd.desc || "")
// 	.action(cmd.action);
//   	cmd.extra(command);
// })

app.command('init')
.description("Initialize a project")
.action(function(){
	let cwd=process.cwd();
	let data={
		name: cwd.split('/').at(-1)
	}
	fs.writeFileSync(`${cwd}/Makefile`,ejs.render(fs.readFileSync(`${__dirname}/templates/Makefile.ejs`).toString(),data));
	console.log("Made Makefile");
	fs.mkdirSync('src');
	console.log("Made src/");
	fs.mkdirSync('dst');
	console.log("Made dst/");
	fs.mkdirSync('include');
	console.log("Made include/");
	fs.writeFileSync(`${cwd}/src/main.cpp`,ejs.render(fs.readFileSync(`${__dirname}/templates/main.cpp.ejs`).toString(),data));
	console.log("Made src/main.cpp");

	console.log("Done!");
});

let newCmd=app.command('new')
.description('Make a new item');

newCmd.command('d')
.option('--namespace, -n <name>','Makes a namespace in the header file')
// .option('--include, -i','Includes the header in the main file')
.argument('<name>')
.description("Create a new source and header file")
.action(function(name) {
	let opts=this.opts();
	let cwd=process.cwd();
	let data={
		name,
		namespace: opts.N,
	}
	if (!validate(cwd)) {
		console.log("ERROR: Could not validate project (Some of the following files are missing: src/ include/ Makefile)");
		process.exit(1);
	}
	if (fs.existsSync(`${cwd}/src/${name}.cpp`)) {
		console.log(`ERROR: src/${name}.cpp already exists!`);
		process.exit(1);
	}
	if (fs.existsSync(`${cwd}/include/${name}.h--`)) {
		console.log(`ERROR: include/${name}.hpp already exists!`);
		process.exit(1);
	}

	fs.writeFileSync(`${cwd}/src/${name}.cpp`,ejs.render(fs.readFileSync(`${__dirname}/templates/source.cpp.ejs`).toString(),data));
	fs.writeFileSync(`${cwd}/include/${name}.hpp`,ejs.render(fs.readFileSync(`${__dirname}/templates/header.hpp.ejs`).toString(),data));

	console.log("Done!");
});


app.parse(process.argv);
