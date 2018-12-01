import { observable, action, computed } from 'mobx';

export default class BasicStore {

    @observable
    basicArr = [];

    @action
    getBasic = () => {
        this.basicArr.push({value:1, text:'this is sample'});
    }

    @computed
    get basic () {
        return this.basicArr;
    }

}