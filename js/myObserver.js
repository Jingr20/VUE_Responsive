class Observer{
    constructor(data){
        this.walk(data);
    }

    walk(data){
        // 1）判断data是否是对象
        if(!data || typeof data !== 'object'){
            return;
        }

        // 2）遍历data对象的所有属性
        Object.keys(data).forEach(key => {
            this.defineReactive(data,key,data[key]);
        });
    }

    defineReactive(data,key,value){
        // 如果value是对象，把value内部的属性转化为响应式数据
        this.walk(value);

        // 为data的每个属性创建dep对象，用于收集依赖/发送依赖
        let dep = new Dep();
       
        let that = this;
        Object.defineProperty(data,key,{
            // 属性描述符对象
            enumerable:true,
            configurable:true,
            get(){
                //收集依赖
                if(Dep.target){
                    dep.addSub(Dep.target);
                }

                // 这里的value虽然是局部变量，但是外部的data[key]会一直调用它，形成了闭包
                return value;
            },
            set(newValue){
                if(newValue === value){
                    return;
                }
                // newValue如果是对象，要把对象的内部属性转化为响应式数据
                that.walk(newValue);
                value = newValue;
                // 发送通知
                dep.notify();
            }
        });
    }

}