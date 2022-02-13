import React, { useCallback, useEffect, useState, useRef } from 'react';
import './index.less';

export interface ServerSlideVertifyProps {
  showInfo: {
    originImg: string;
    blockBgImg: string;
    blockImg: string;
    message?: string;
    fillDefaultColor?: string;
    fillSuccessColor?: string;
    fillFailedColor?: string;
  };
  onEnd?: (uDistance: number, radio: number, setSuccess: () => void, setFailed: () => void) => {};
  onRefresh?: () => {};
}

// 服务端交互人机验证码
const ServerSlideVertify: React.FC<ServerSlideVertifyProps> = ({ showInfo, onEnd, onRefresh }) => {
  const {
    originImg,
    blockBgImg,
    blockImg,
    message = '滑动验证',
    fillDefaultColor,
    fillSuccessColor,
    fillFailedColor,
  } = showInfo || {};

  const bgRef = useRef<any>(null);
  const blockBgRef = useRef<any>(null);
  const blockRef = useRef<any>(null);
  const squareRef = useRef<any>(null);
  const fillRef = useRef<any>(null);

  const dragInfoRef = useRef<any>({
    isMouseDown: false,
    originPosition: { x: 0, y: 0 },
    width: 0,
  });
  const [status, setStatus] = useState('loading'); // pending, judging, success, failed
  const preImg = useRef<any>();

  const judge = useCallback((moveX) => {
    if (moveX < 0) {
      moveX = 0;
    } else if (moveX + blockRef.current.offsetWidth > dragInfoRef.current.width) {
      moveX = dragInfoRef.current.width - blockRef.current.offsetWidth;
    }
    // 回调通知
    // 移动距离
    onEnd &&
      onEnd(
        moveX,
        moveX / (dragInfoRef.current.width - blockRef.current.offsetWidth),
        () => setStatus('success'),
        () => setStatus('failed'),
      );
    dragInfoRef.current.isMouseDown = false;

    setStatus('judging');
    return moveX;
  }, []);

  // 拖拽逻辑
  const handleDragStart = useCallback(
    (e) => {
      if (status !== 'pending') return;
      bgRef.current.style.display = 'none';
      // 记录当前触摸位置
      // 标记为， 可拖拽状态 （鼠标按下）
      dragInfoRef.current.isMouseDown = true;
      dragInfoRef.current.originPosition = {
        x: e.clientX || e.touches[0].clientX,
        y: e.clientY || e.touches[0].clientY,
      };
    },
    [status],
  );
  const handleDragMove = useCallback((e) => {
    if (!dragInfoRef.current.isMouseDown) return;
    // 移动逻辑
    e.preventDefault();
    const eventX = e.clientX || e.touches[0].clientX;
    let moveX = eventX - dragInfoRef.current.originPosition.x;
    // const moveY = eventY - dragInfoRef.current.originPosition.y;
    if (moveX < 0 || moveX + blockRef.current.offsetWidth > dragInfoRef.current.width) {
      moveX = judge(moveX);
    }
    blockRef.current.style.left = moveX + 'px';
    squareRef.current.style.left = moveX + 'px';
  }, []);
  const handleDragEnd = useCallback((e) => {
    if (!dragInfoRef.current.isMouseDown) return;
    const eventX = e.clientX || e.changedTouches[0].clientX;
    let moveX = eventX - dragInfoRef.current.originPosition.x;
    judge(moveX);
  }, []);

  const refresh = useCallback(() => {
    // 复位
    bgRef.current.style.display = 'block';
    squareRef.current.style.left = '0';
    blockRef.current.style.left = '0';
    setStatus('pending');
    onRefresh && onRefresh();
  }, [onRefresh, originImg]);

  useEffect(() => {
    if (preImg.current !== originImg) {
      setStatus('loading');
    } else {
      setStatus('pending');
    }
    preImg.current = originImg;
  }, [originImg]);

  useEffect(() => {
    switch (status) {
      case 'loading':
      case 'pending':
        fillDefaultColor && (fillRef.current.style.backgroundColor = fillDefaultColor);
        break;
      case 'success':
        fillSuccessColor && (fillRef.current.style.backgroundColor = fillSuccessColor);
        break;
      case 'failed':
        fillFailedColor && (fillRef.current.style.backgroundColor = fillFailedColor);
        setTimeout(() => {
          refresh();
        }, 1000);
        break;
    }
  }, [status, refresh]);

  return (
    <div
      className="vertify-container"
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="img-container">
        <img
          src={blockBgImg}
          ref={blockBgRef}
          alt=""
          className="slide-block-bg"
          onLoad={() => {
            dragInfoRef.current.width = blockBgRef.current.offsetWidth;
            fillRef.current.style.width = dragInfoRef.current.width + 'px';
            fillRef.current.style.left = -dragInfoRef.current.width + 'px';
            setStatus('pending');
          }}
          onError={() => {
            setStatus('pending');
          }}
        />
        <img
          ref={blockRef}
          src={blockImg}
          alt=""
          className="slide-block"
          onLoad={() => {
            squareRef.current.style.width = blockRef.current.offsetWidth + 'px';
          }}
        />
        {originImg && <img ref={bgRef} src={originImg} alt="" className="slide-bg" />}

        {['loading', 'judging'].includes(status) ? (
          <div className={`status ${status}`}></div>
        ) : null}
        {['loading', 'judging'].includes(status) ? null : (
          <div className="refresh" onClick={refresh}></div>
        )}
      </div>
      <div className="slide-bar noselect" unselectable="on">
        {message}
        <div
          className={`square ${status}`}
          ref={squareRef}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <div className="fill" ref={fillRef}></div>
        </div>
      </div>
    </div>
  );
};

export default ServerSlideVertify;
