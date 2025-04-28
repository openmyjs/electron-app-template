export interface Click {
  selector: string;
  wait: boolean;
  remark: string;
  goOn: boolean;
  index?: number;
}
export interface MouseClick {
  x: number;
  y: number;
  wait: boolean;
  remark: string
}

export interface Returns {
  code: number;
  status:boolean;
  error?: any ;
}

export interface NewPageGoto {
  value: string;
  valueType: string;
  recordScript: boolean;
}

export interface Input {
  selector: string;
  valueType: string;
  value: string | [];
  delay?: number;
}

export interface UpLoadFile {
  selector: string; value: string | []; valueType: string
}


export interface Select {
  selector: {
    title: string;
    option: string
  };
  value: '';
  valueType: string
}

export interface AutoSelect {
  value: [];
  valueType: string
}

export interface TitleToClick {
  selector: {
    title: string;
    option: string
  };
  value: [];
  valueType: string
}

export interface Connect {
  value: string;
  valueType: string;
}
export interface Radio {
  selector: {
    [key:string]: string;
  };
  value: [] | string;
  valueType: string
}

export interface GetElementData {
  returns:{
    /**
     * 标签名
     * */
    agName: string; // 标签名
    attributes:string[]; // 属性字符串
    id: string; // 元素的 id
    className: string; // 元素的类名
    textContent: string; // 文本内容，去除多余空白
    clientX:number; // 元素的水平位置
    clientY: number; // 元素的垂直位置
    selector: string; // 元素的定位器
    index: number; // 元素在页面中的索引
  }[]

}