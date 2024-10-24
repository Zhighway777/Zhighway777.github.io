---
title: "Python Advanced Skills"
date: 2024-10-15T20:39:53+08:00
draft: false
tags: ["Python", "Tools", "Tutorial"]
featured_image: ""
description: "This blog will show you some advanced python technology and common packages or tools in Modeling and Test."

---
# Useful tools

## pytest




# Advanced methods
## yield
1. 如果一个函数中使用yield来修饰一变量，那么这个函数会作为一个generate(), 当调用此函数的时候，并不会运行此函数，而是返回一个generate对象
2. 对于这个函数(对象)，使用next()方法让其开始运行。
3. 遇到yield就相当于遇到return, 这时将返回一个结果，但区别是函数会记录执行到此位置，下次接着从yield所在的地方开始执行()
4. 再次调用next(), 从上一次yield的地方开始运行，知道执行到下一次yield的地方。
5. 可以使用for语句来[循环迭代 生成器 (generate class)]， 逐个获取generate()的返回值。同时，for循环内部自动处理停止迭代异常。
6. 当生成器中的数据全部生成完毕(后续再也没有yield指令或者循环结束)，再次调用next(gen)的时候，会抛出StopIteration异常，表示数据生成完毕。
```py
def func():
	for i in range(10):
		yield 1 * 1
gen = func()


#1
print(func)
#输出<generator object generator at 0x0000....>


#2,3
print("frist time")
print(next(gen))
#输出0


#4
print("second time")
print(next(gen))
#输出1


#5
for value in func():
	print(value)
#输出 4, 9, 16, .... , 81

#6
print(next(gen)) 
#抛出 StopIteration 异常 Process finished.
```
## yield from 
yield from 语法可以简化生成器函数的定义。yield from 可以将一个嵌套的生成器的值逐个返回给调用者，而不需要手动遍历嵌套生成器的每个值。例如：
```py
def my_generator():
    yield from [1, 2, 3]
    yield from (4, 5, 6)
    yield from my_other_generator()

def my_other_generator():
    yield "a"
    yield "b"
    yield "c"
```
在这个例子中，my_generator 函数使用 yield from 将一个列表、一个元组和另一个生成器的值逐个返回给调用者。调用 my_generator 函数时，它会返回一个生成器对象，该对象将逐个返回下列值：1、2、3、4、5、6、"a"、"b" 和 "c"。


REF:  ![Python | yield关键字详解](https://www.cnblogs.com/zhangxuegold/p/17526726.html)

## getattr()

## enumerate()

## get()

## asdit()

## @classmethod

## @functools

