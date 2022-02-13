import React from 'react';

const noticeString: (str: string | number, key: string, kvElement?: (kv: string) => any) => any = (
  str,
  key,
  kvElement,
) => {
  let wordList = ('' + str).split(key);

  return (
    <>
      {wordList.map((item, idx) => {
        return idx !== 0 ? (
          <React.Fragment key={idx}>
            {kvElement ? kvElement(key) : <span style={{ color: 'red' }}>{key}</span>}
            {item}
          </React.Fragment>
        ) : (
          item
        );
      })}
    </>
  );
};

const noticeWord: (kv: string, elements: any[], kvElement?: (kv: string) => any) => any = (
  kv,
  elements,
  kvElement,
) => {
  return React.Children.map(elements, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return noticeString(child, kv, kvElement);
    }
    if (typeof child.type === 'function') {
      child = { ...child, type: withKeyWordNotice(kvElement)(child.type) };
      child.props = { ...child.props, kv };

      return child;
    }

    if (child.props && child.props.children && child.props.children.length > 0) {
      return React.cloneElement(
        child,
        child.props,
        noticeWord(kv, child.props.children, kvElement),
      );
    }
    return child;
  });
};

const withKeyWordNotice = (kvElement?: (kv: string) => any) => (Component: any) => {
  if (Component.prototype.isReactComponent) {
    return class extends Component {
      render() {
        const props: any = this.props;
        let element: any = super.render();
        const key = props.kv || '';
        if (key.trim().length === 0) return element;
        let newElement = noticeWord(key, element.props.children, kvElement);
        return React.cloneElement(element, element.props, newElement);
      }
    };
  }

  return (_props: any) => {
    let element = Component(_props);
    let key = _props.kv || '';

    if (key.trim().length === 0) return element;
    let newElement = noticeWord(key, element.props.children, kvElement);
    return React.cloneElement(element, element.props, newElement);
  };
};

export default withKeyWordNotice;
