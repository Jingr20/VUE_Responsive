class Compiler{
    constructor(vm){
        this.el = vm.$el;
        this.vm = vm;
        this.compiler(this.el);
    }

    // 编译模版，处理元素节点和文本节点
    compiler(el){
        // 遍历el代表模版的所有子节点，结果是伪数组（具有length属性的对象）
        let childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if(this.isTextNode(node)){
                this.compilerText(node);
            }else if(this.isElementNode(node)){
                this.compilerElement(node);
            }

            // 判断node节点是否有子节点，若有，则递归调用compiler
            if(node.childNodes && node.childNodes.length){
                this.compiler(node);
            }
        });
    }

    // 编译元素节点，处理指令
    compilerElement(node){
        // console.log(node.attributes);
        // 遍历该节点的所有html属性
        let attributes = node.attributes;
        Array.from(attributes).forEach(attri => {
            // 判断是否指令
            if(this.isDirective(attri.name)){
                // v-text -> text
                let attriName = attri.name.substr(2);
                let key = attri.value;
                this.update(node,key,attriName);
            }
        });
    }

    update(node,key,attriName){
        let updateFn = this[attriName + 'Updater'];
        // 直接调用会改变this指向
        updateFn && updateFn.call(this,node,key,this.vm[key]);
    }

    textUpdater(node,key,value){
        node.textContent = value;
        // 创建watcher对象，数据变化更新视图
        new Watcher(this.vm,key,(newValue) => {
            node.textContent = newValue;
        });
    }

    modelUpdater(node,key,value){
        node.value = value;
        // 创建watcher对象，数据变化更新视图
        new Watcher(this.vm,key,(newValue) => {
            node.value = newValue;
        });

        // 实现双向绑定：绑定input事件，给data赋值，从而触发响应式机制，更新视图
        node.addEventListener('input',()=>{
            this.vm[key] = node.value;
        });
    }

    // 编译文本节点，处理插值表达式
    compilerText(node){
        // console.dir(node);
        // 正则表达式匹配插值表达式
        let reg = /\{\{(.+?)\}\}/;
        let value = node.textContent;
        if(reg.test(value)){
            // 去掉前后空格，提取变量名字
            let key = RegExp.$1.trim();
            node.textContent = value.replace(reg,this.vm[key]);

            // 创建watcher对象，数据改变更新视图
            new Watcher(this.vm,key,(newValue)=>{
                node.textContent = newValue;
            });
        }
    }

    // 判断元素属性是否是指令
    isDirective(attrName){
        return attrName.startsWith('v-');
    }

    // 判断节点是否是文本节点
    isTextNode(node){
        return node.nodeType === 3;
    }

    // 判断节点是否是元素节点
    isElementNode(node){
        return node.nodeType === 1;
    }
}