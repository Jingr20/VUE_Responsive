class Watcher{
    // data里每个属性都对应一个watcher
    constructor(vm,key,cb){
        this.vm = vm;
        // data中的属性名称
        this.key = key;
        // 回调函数负责更新视图
        this.cb = cb;

        // 自身实例化时，记录到Dep类的静态属性target上
        Dep.target = this;
        // 触发get方法(vm[key])，在get方法中调用addSub
        this.oldValue = vm[key];
        Dep.target = null;

    }

    // 数据变化时更新视图
    update(){
        // 获取变化后的新值
        let newValue = this.vm[this.key]; 
        if(newValue === this.oldValue)  return;
        // 更新视图
        this.cb(newValue);
    }

}