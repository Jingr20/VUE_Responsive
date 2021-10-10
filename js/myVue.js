class Vue{
    // 1、负责接收初始化参数（选项）——一个对象
    constructor(options){
        this.$options = options || {};
        this.$data = options.data || {};
        this.$el = (typeof options.el) === 'string'? document.querySelector(options.el):options.el;

        // 2、负责把data中的成员注入到Vue实例，转化为getter/setter
        this._proxyData(this.$data);

        // 3、调用observer监听data所有属性的变化
        new Observer(this.$data);

        // 4、调用compiler解析指令/插值表达式
        new Compiler(this);
    }
    
    _proxyData(data){
        // 遍历data中的所有属性
        Object.keys(data).forEach(key => {
            // 注意this的指向，应为Vue实例。属性注入到Vue实例中
            Object.defineProperty(this,key,{
                // 属性描述符对象
                enumerable:true,
                configurable:true,

                get(){
                    return data[key];
                },

                set(newValue){
                    if(data[key] === newValue){
                        return;
                    }
                    data[key] = newValue;
                }
            });
        });
    }
    
}