---
nav:
  title: Hocs
  path: /hocs
---

## withKeyWordNotice

### 功能描述

- 根据传递给组件的关键字 kv 以及 关键字替换回调，实现关键字定制化高亮展示
- 支持函数组件、类组件、嵌套组件的包装
- 支持高亮定制化样式
- 支持忽略字段控制

### 使用方式

包装类组件:

```tsx
import React from 'react';
import { withKeyWordNotice } from '@like/hocs';

class Card extends React.Component {
  render() {
    const { title, price, src } = this.props.item;
    return (
      <div
        style={{
          width: '200px',
          border: '1px solid pink',
          borderRadius: '10px',
          marginTop: '15px',
          overflow: 'hidden',
          padding: '8px',
          boxSizing: 'border-box',
        }}
      >
        <img width="100%" alt="" src={src} />
        <h3>菜名： {title}</h3>
        <h4 className="price ignore-kv-notice">价格(忽略高亮)： {price}元</h4>
        <h4 className="price">价格： {price}元</h4>
      </div>
    );
  }
}

Card = withKeyWordNotice((kv) => {
  return <span style={{ color: 'red', fontWeight: 'bold' }}>{kv}</span>;
})(Card);

function App() {
  const [data, setData] = React.useState([]);
  const [kv, setKv] = React.useState('鸡');
  React.useEffect(() => {
    setData([
      {
        id: 0,
        title: '烧鸡',
        price: 10,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 1,
        title: '大鹅',
        price: 11,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 2,
        title: '鸭鸭',
        price: 12,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 3,
        title: '兔兔',
        price: 13,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
    ]);
  }, []);
  return (
    <div>
      <input value={kv} onChange={(e) => setKv(e.target.value)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {data.map((item) => {
          return <Card item={item} key={item.id} kv={kv} />;
        })}
      </div>
    </div>
  );
}

export default App;
```

包装函数组件:

```tsx
import React from 'react';
import { withKeyWordNotice } from '@like/hocs';

function Card({ item }) {
  const { title, price, src } = item;
  return (
    <div
      style={{
        width: '200px',
        border: '1px solid pink',
        borderRadius: '10px',
        marginTop: '15px',
        overflow: 'hidden',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      <img width="100%" alt="" src={src} />
      <h3>菜名： {title}</h3>
      <h4>价格： {price}元</h4>
    </div>
  );
}

Card = withKeyWordNotice((kv) => {
  return <span style={{ color: 'red', fontWeight: 'bold' }}>{kv}</span>;
})(Card);

function App() {
  const [data, setData] = React.useState([]);
  const [kv, setKv] = React.useState('鸡');
  React.useEffect(() => {
    setData([
      {
        id: 0,
        title: '烧鸡',
        price: 10,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 1,
        title: '大鹅',
        price: 11,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 2,
        title: '鸭鸭',
        price: 12,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 3,
        title: '兔兔',
        price: 13,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
    ]);
  }, []);
  return (
    <div>
      <input value={kv} onChange={(e) => setKv(e.target.value)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {data.map((item) => {
          return <Card item={item} key={item.id} kv={kv} />;
        })}
      </div>
    </div>
  );
}

export default App;
```

包装嵌套组件:

```tsx
import React from 'react';
import { withKeyWordNotice } from '@like/hocs';

function Card({ item }) {
  const { title, price, src } = item;
  return (
    <div
      style={{
        width: '200px',
        border: '1px solid pink',
        borderRadius: '10px',
        marginTop: '15px',
        overflow: 'hidden',
        padding: '8px',
        boxSizing: 'border-box',
      }}
    >
      <img width="100%" alt="" src={src} />
      <h3>菜名： {title}</h3>
      <h4>价格： {price}元</h4>
    </div>
  );
}

function Root() {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    setData([
      {
        id: 0,
        title: '烧鸡',
        price: 10,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 1,
        title: '大鹅',
        price: 11,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 2,
        title: '鸭鸭',
        price: 12,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
      {
        id: 3,
        title: '兔兔',
        price: 13,
        src: `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/200/100`,
      },
    ]);
  }, []);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {data.map((item) => {
        return <Card item={item} key={item.id} />;
      })}
    </div>
  );
}

Root = withKeyWordNotice((kv) => {
  return <span style={{ color: 'red', fontWeight: 'bold' }}>{kv}</span>;
})(Root);

function App() {
  const [kv, setKv] = React.useState('鸡');
  return (
    <>
      <input value={kv} onChange={(e) => setKv(e.target.value)} />
      <Root kv={kv} />
    </>
  );
}

export default App;
```
