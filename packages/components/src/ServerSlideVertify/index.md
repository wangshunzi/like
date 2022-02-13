---
nav:
  path: /components
---

## ServerSlideVertify

## 组件介绍
- 本组件，主要适用于，人机交互识别，滑动验证码组件



## 使用示例:

```tsx
import React from 'react';
import { ServerSlideVertify } from '@like/components';
import o1 from './test_img/o1.png'
import o1_bg from './test_img/o1_bg.png'
import o1_block from './test_img/o1_block.png'

import o2 from './test_img/o2.png'
import o2_bg from './test_img/o2_bg.png'
import o2_block from './test_img/o2_block.png'

const {useState} = React
function App() {
  const [state, setState] = useState({
      originImg: o1,
      blockBgImg: o1_bg,
      blockImg: o1_block,
  })
  return <div>
    <ServerSlideVertify
     onEnd={(distance, radio, setSucess, setFailed) => {
       console.log(distance, radio)
       setTimeout(() => {
        if (distance > 100) {
          setSucess()
        } else {
          setFailed()
        }
       }, 2000)
      
    }} 
    onRefresh={
      () => {
        setState({
          originImg: 'https://obj.kesion.cn/Images/school/6500/202105/%E5%9B%BE%E6%80%AA%E5%85%BD_d99e55eccf2ea5a14e68e82cc1914313_30326.png',
          // originImg: o2,
          blockBgImg: o2_bg,
          blockImg: o2_block,
        })
      }
    }
    showInfo={
      {
      width: 400,
      fillDefaultColor: '#ccc',
      fillSuccessColor: 'green',
      fillFailedColor: 'red',
      message: '滑动完成拼图',
      originImg: state.originImg,
      blockBgImg: state.blockBgImg,
      blockImg: state.blockImg,
    }}/>
  </div>
}
export default App;
```
<API></API>

更多使用说明：请参考 itlike.com: 
