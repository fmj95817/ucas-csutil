## UCAS 选课实用工具

### 安装
1. 安装node.js：
	* Windows：从[node.js网站](https://nodejs.org/en/download/)下载合适的安装程序并安装。
	* macOS：在终端执行命令
	
		```bash
		brew install nodejs
		```
	* Linux (Debian based)：
	
		```bash
		sudo apt-get install nodejs
		```
	* Linux (ArchLinux based)：
	
		```bash
		sudo pacman -Sy nodejs
		```
2. 安装本工具：执行命令

	```bash
	npm install -g ucas-csutil
	```

### GUI工具使用
1. 执行如下命令启动GUI：

	```bash
	gcsutil
	```

2. 按提示操作

### 命令行工具使用
1. 初始化

	```bash
	csutil init
	```
2. 配置Sep系统的用户名和密码

	```bash
	csutil config --username=Sep用户名 --password=Sep密码
	```
3. 添加需要选择的课程 (可添加多个)

	```bash
	csutil add --dept=开课单位代码 --code=课程代码
	```
4. 登录系统

	```bash
	csutil login
	```
5. 查询选课信息并适时提交选课 (默认查询间隔为1分钟)

	```bash
	csutil query
	```