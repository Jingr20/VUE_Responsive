class Dep{
    constructor(){
        this.subs = [];
    }

    // 添加观察者
    addSub(sub){
        if(sub && sub.update){
            this.subs.push(sub);
        }
    }

    // 通知观察者（调用其update方法）
    notify(){
        this.subs.forEach(sub => {
            sub.update();
        });
    }
}