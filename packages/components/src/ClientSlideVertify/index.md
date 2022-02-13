---
nav:
  path: /components
---

## ClientSlideVertify

## 组件介绍
- 本组件，主要适用于，人机交互识别，滑动验证码组件



## 使用示例:

```tsx
import React from 'react';
import { ClientSlideVertify } from '@like/components';

function App() {
  return <div>
    <ClientSlideVertify showInfo={{
      imgW: 500,
      imgH: 300,
      fillDefaultColor: '#ccc',
      fillSuccessColor: 'green',
      fillFailedColor: 'red',
      message: '滑动完成拼图',
      // imgUrl: 'https://i.picsum.photos/id/922/500/300.jpg?hmac=4nLmFOwe1T6OjOp1eydAD2_dMEXpZOdPM6JoUCC9B6o'
    }} onSuccess={()=>{
      console.log("success")
    }} onFailed={()=>{
      console.log("failed")
    }} onEnd={
      (uD, sD) => {
        console.log(uD, sD)
      }
    }/>
  </div>
}
export default App;
```
<API></API>

更多使用说明：请参考 itlike.com: 
