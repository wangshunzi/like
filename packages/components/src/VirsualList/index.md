---
nav:
  path: /components
---

## VirsualList

## 组件介绍
- 本组件，主要适用于，长列表滚动性能优化：避免加载过多cell；导致卡屏/白屏现象

## 实现原理
- 通过分页+埋标记；监听加载（上一页/下一页）；动态切换数据后，调整面板视觉位置


## 使用示例:

```tsx
import React from 'react';
import { VirsualList } from '@like/components';
const {useState, useEffect, useCallback} = React;


function App() {
  const [totalList, setTotalList] = useState([])
  const randomColor = useCallback(() => {
    let r = Math.round(Math.random() * 255)
    let g = Math.round(Math.random() * 255)
    let b = Math.round(Math.random() * 255)
    return [`rgb(${r}, ${g}, ${b})`, `rgb(${255 - r}, ${255 - g}, ${255 - b})`]
  }, [])
  useEffect(() => {
    setTotalList(Array(50).fill(0).map((v, i) => {
      let [color, patchColor] = randomColor()
      return {
        value: i + 1,
        height: (i + 1) % 8 * 30 + 20,
        bgColor: color,
        fColor: patchColor
      }
    }))
  }, [])

  
  return <div>
    <VirsualList data={totalList} initPageCount={5} autoAdjustPageCount={true} height='500px'>
        {
          item => (
            <div 
            key={item.value} 
            style={{ 
              lineHeight: `${item.height}px`, 
              backgroundColor: item.bgColor, color: item.fColor, 
              borderBottom: "2px solid pink" 
            }}>
              like-cell-{item.value}
            </div>
          )
        }
    </VirsualList>
    <button onClick={() => {
      let [color, patchColor] = randomColor()
       setTotalList([...totalList, {
        value: totalList.length + 1,
        height: (totalList.length + 1) % 8 * 30 + 20,
        bgColor: color,
        fColor: patchColor
      }])
    
    }}>添加数据</button>
  </div>
}
export default App;
```
<API></API>

更多使用说明：请参考 itlike.com: 
