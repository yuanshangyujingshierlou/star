#!/usr/bin/python
# -*- coding: utf-8 -*-
import os,os.path,shutil
import sys,getopt
#压缩文件
import zipfile

def zip_yasuo(start_dir):
    file_news = start_dir + '.zip'                                    
    z = zipfile.ZipFile(file_news, 'w', zipfile.ZIP_DEFLATED)        
    for dir_path, dir_names, file_names in os.walk(start_dir):
        file_path = dir_path.replace(start_dir, '')     
        file_path = file_path and file_path + os.sep or ''         
        for filename in file_names:
            z.write(os.path.join(dir_path, filename), file_path+filename)
    z.close()

#压缩图片
def reducePic(srcFile,dstFile):
	cmd = "pngquant -f --quality 30-90 --output %s %s" %(srcFile, dstFile)
	os.system(cmd)

#循环递归遍历文件夹
def traverse(file_dir):
    #返回指定路径下的文件和文件夹列表。
	fs = os.listdir(file_dir)
	for dir in fs:
        #os.path.join将多个路径组合后返回
		tmp_path = os.path.join(file_dir, dir)
        #os.path.isdir用于判断对象是否为一个目录。
		if not os.path.isdir(tmp_path): 
            #os.path.splitext() 将文件名和扩展名分开
			tu = os.path.splitext(tmp_path)
			
			if tu[1] in g_reduceFileExt:
				# newPath = tmp_path.replace(g_srcPath,g_dstPath)
				# print(newPath)
				print(tmp_path)
				# newPath = os.path.dirname(os.path.realpath(__file__))+'/ldd'
				reducePic(tmp_path,tmp_path)
		else:
			# createFloder(tmp_path.replace(g_srcPath,g_dstPath))
			traverse(tmp_path)

def getFloderPath():
	opts,args = getopt.getopt(sys.argv[1:],"p:s:")
	file_path=""
	for op,value in opts:
		if op == "-p":
			file_path=value
	return file_path
 
def createFloder(dstpath):
	if not os.path.exists(dstpath): 
		os.mkdir(dstpath)
def yaShuo(gameMulu,mulu):
	#当前路径
	global g_curDir #若想在函数内部对函数外的变量进行操作，就需要在函数内部声明其为global。
    # os.path.dirname 去掉文件名，返回目录
    # os.path.realpath 获取当前执行脚本的绝对路径。
	g_curDir=os.path.dirname(os.path.realpath(__file__))
	
	#需要压缩的图片扩展名
	global g_reduceFileExt
	g_reduceFileExt=['.png','.jpg']

	#压缩后的图片存储目录
	# global g_dstPath
	# g_dstPath=g_curDir+'\\reduces'
	# createFloder(g_dstPath)
 
	# global g_srcPath
	# g_srcPath = getFloderPath()
	# print(g_srcPath)
	print(g_curDir)
	# g_curDir=g_curDir+'/aishangdati/res/'
	g_curDir = gameMulu + '/build/' + mulu + '/res/'
	traverse(g_curDir)

def mycopy(source_path,target_path):#定义一个mycopy函数用于复制文件
	

	if not os.path.exists(target_path):
	    # 如果目标路径不存在原文件夹的话就创建
	    os.makedirs(target_path)

	if os.path.exists(source_path):
	    # 如果目标路径存在原文件夹的话就先删除
	    shutil.rmtree(target_path)

	shutil.copytree(source_path, target_path)
	

def main():
	gameMulu = '/Users/lidongdong/Documents/SVN/AiWanXiaoXiao/client/proj/AiWanXiaoXiao_new_App_1'
	mulu = "AiWanXiaoXiao_new_test"
	my_file = gameMulu + '/build/' + mulu
	my_file_zip = gameMulu + '/build/' + mulu + '.zip'
	if os.path.exists(my_file_zip):
		os.remove(my_file_zip) 
	if os.path.exists(my_file):
		shutil.rmtree(gameMulu + '/build/' + mulu + '/')
	print('删除完成')
	cmd = "/Applications/CocosCreator/Creator/2.3.3/CocosCreator.app/Contents/MacOS/CocosCreator --path " + gameMulu + " --build"
	os.system(cmd)
	print('编译弯沉')

	source_path_1 = os.path.abspath(gameMulu + '/build/jsb-default/src')
	target_path_1 = os.path.abspath(gameMulu + '/build/'+mulu+'/src')
	source_path_2 = os.path.abspath(gameMulu + '/build/jsb-default/res')
	target_path_2 = os.path.abspath(gameMulu + '/build/'+mulu+'/res')
	source_path_3 = os.path.abspath(gameMulu + '/build/jsb-default/jsb-adapter')
	target_path_3 = os.path.abspath(gameMulu + '/build/'+mulu+'/jsb-adapter')
	source_path_4 = os.path.abspath(gameMulu + '/build/jsb-default/project.json')
	target_path_4 = os.path.abspath(gameMulu + '/build/'+mulu+'/')
	source_path_5 = os.path.abspath(gameMulu + '/build/jsb-default/main.js')
	target_path_5 = os.path.abspath(gameMulu + '/build/'+mulu+'/')
	
	mycopy(source_path_1,target_path_1)
	mycopy(source_path_2,target_path_2)
	mycopy(source_path_3,target_path_3)
	shutil.copy(source_path_4,target_path_4)
	shutil.copy(source_path_5,target_path_5)
	print('拷贝完成')

	yaShuo(gameMulu,mulu)

	print('压缩图片完成')

	src_yasuo = gameMulu + '/build/' + mulu
	zip_yasuo(src_yasuo)

	ccmd = "open " + gameMulu + '/build/' + mulu
	os.system(ccmd)

if __name__ == '__main__':
	main()