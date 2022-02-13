import React, { useCallback, useEffect, useState } from 'react';
import './index.less';

const { useRef } = React;

export interface ClientSlideVertifyProps {
  showInfo: {
    imgW?: number;
    imgH?: number;
    tolerant?: number;
    imgUrl?: string;
    blockPosition?: { x: number; y: number };
    message?: string;
    fillDefaultColor?: string;
    fillSuccessColor?: string;
    fillFailedColor?: string;
  };
  onSuccess?: () => {};
  onFailed?: () => {};
}

/**
 * 根据图片源， 加载图片， 支持跨域
 * @param imgSrc 图片源
 * @param onload 加载成功回调
 * @param onError 加载失败回调
 */
const loadImg = (
  imgSrc: string,
  onload: (i: HTMLImageElement) => void,
  onError: (i: HTMLImageElement) => void,
) => {
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    onload(img);
  };
  img.onerror = () => {
    onError(img);
  };

  // 绑定设置图片源方法， 兼容IE
  (img as any).retryCount = 0;
  (img as any).setSrc = (src: string) => {
    (img as any).retryCount++;
    if ((img as any).retryCount > 6) return;
    const isIE = window.navigator.userAgent.indexOf('Trident') > -1;
    if (!isIE) {
      img.src = src;
      return;
    }

    // IE浏览器无法通过img.crossOrigin跨域，使用ajax获取图片blob然后转为dataURL显示
    const xhr = new XMLHttpRequest();
    xhr.onloadend = function (e: any) {
      const file = new FileReader(); // FileReader仅支持IE10+
      file.readAsDataURL(e.target.response);
      file.onloadend = function (e) {
        img.src = e?.target?.result as string;
      };
    };
    xhr.open('GET', src);
    xhr.responseType = 'blob';
    xhr.send();
  };

  (img as any).setSrc(imgSrc);
};

const drawPath = (ctx: any, x: number, y: number, operation: 'fill' | 'clip' = 'fill') => {
  let l = 35,
    r = 5,
    PI = Math.PI;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.stroke();
  ctx.globalCompositeOperation = 'destination-over';
  operation === 'fill' ? ctx.fill() : ctx.clip();

  return [x, y - 2 * r, l + 2 * r];
};

// 只做客户端简单验证；安全性较差（可被绕过）
const ClientSlideVertify: React.FC<ClientSlideVertifyProps> = ({
  showInfo,
  onSuccess,
  onFailed,
}) => {
  const {
    imgW = 400,
    imgH = 200,
    tolerant = 20,
    imgUrl,
    blockPosition,
    message = '滑动验证',
    fillDefaultColor,
    fillSuccessColor,
    fillFailedColor,
  } = showInfo || {};

  const canvasRef = useRef<any>(null);
  const blockRef = useRef<any>(null);
  const squareRef = useRef<any>(null);
  const fillRef = useRef<any>(null);
  const successInfoRef = useRef<any>({
    x: 0,
    y: 0,
  });
  const dragInfoRef = useRef<any>({
    isMouseDown: false,
    originPosition: { x: 0, y: 0 },
  });
  const [status, setStatus] = useState('loading'); // pending, success, failed
  // 初始化滑动面板
  const initSlidePane = useCallback(() => {
    // 2.2 复位状态为 loading
    setStatus('loading');

    // 1. 确定渲染信息
    // 图片尺寸
    let w = imgW,
      h = imgH;
    // 图片源：为空则随机
    let gImgSrc = () =>
      imgUrl || `https://picsum.photos/id/${Math.round(Math.random() * 1084)}/${imgW}/${imgH}`;
    // 镂空位置：为空则随机(滑块尺寸 45 x 45), 记录正确位置，用于后续判定
    successInfoRef.current = blockPosition || {
      x: Math.floor(Math.random() * (w - 145) + 100),
      y: Math.floor(Math.random() * (h - 45)),
    };
    let bP = successInfoRef.current;

    // 2. 初始化, 防止重复调用， 引发的位置错乱
    // 2.1 ref的尺寸和位置

    blockRef.current.width = w;
    blockRef.current.height = h;
    blockRef.current.style.top = 0;
    blockRef.current.style.left = 0;
    squareRef.current.style.left = 0;
    fillRef.current.style.width = 0;
    fillDefaultColor && (fillRef.current.style.backgroundColor = fillDefaultColor);

    // 2.3 清空画布，重新绘制
    // 获取canvas 上下文
    const canvasCtx = canvasRef.current.getContext('2d');
    const blockCtx = blockRef.current.getContext('2d');

    loadImg(
      gImgSrc(),
      (img) => {
        // 状态 => 待判定
        setStatus('pending');
        // draw(img);
        // 复位：清空画布
        canvasCtx.clearRect(0, 0, w, h);
        blockCtx.clearRect(0, 0, w, h);

        // 绘制镂空背景
        drawPath(canvasCtx, bP.x, bP.y, 'fill');
        canvasCtx.drawImage(img, 0, 0, imgW, imgH);

        // 绘制凸起图形块
        let [dx, dy, wh] = drawPath(blockCtx, bP.x, bP.y, 'clip');
        blockCtx.drawImage(img, 0, 0, imgW, imgH);
        const ImageData = blockCtx.getImageData(dx, dy, wh, wh);
        blockRef.current.width = wh;
        blockRef.current.height = wh;
        blockRef.current.style.top = dy + 'px';
        blockCtx.putImageData(ImageData, 0, 0);
      },
      (img) => {
        (img as any).setSrc(gImgSrc());
      },
    );
  }, []);

  useEffect(() => {
    initSlidePane();
  }, []);

  const judge = useCallback((moveX) => {
    if (moveX < 0) {
      moveX = 0;
    } else if (moveX + blockRef.current.offsetWidth > imgW) {
      moveX = imgW - blockRef.current.offsetWidth;
    }
    // 判定逻辑
    if (Math.abs(successInfoRef.current.x - moveX) <= tolerant) {
      fillSuccessColor && (fillRef.current.style.backgroundColor = fillSuccessColor);
      setStatus('success');
      onSuccess && onSuccess();
    } else {
      fillSuccessColor && (fillRef.current.style.backgroundColor = fillFailedColor);
      setStatus('failed');
      onFailed && onFailed();
      setTimeout(initSlidePane, 1000);
    }

    dragInfoRef.current.isMouseDown = false;
    return moveX;
  }, []);

  // 拖拽逻辑
  const handleDragStart = useCallback(
    (e) => {
      if (status !== 'pending') return;
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
    // const eventY = e.clientY || e.touches[0].clientY;
    let moveX = eventX - dragInfoRef.current.originPosition.x;
    // const moveY = eventY - dragInfoRef.current.originPosition.y;
    if (moveX < 0 || moveX + blockRef.current.offsetWidth > imgW) {
      moveX = judge(moveX);
    }
    blockRef.current.style.left = moveX + 'px';
    squareRef.current.style.left = moveX + 'px';
    fillRef.current.style.width = moveX + 'px';
  }, []);
  const handleDragEnd = useCallback((e) => {
    if (!dragInfoRef.current.isMouseDown) return;
    const eventX = e.clientX || e.changedTouches[0].clientX;
    const moveX = eventX - dragInfoRef.current.originPosition.x;

    judge(moveX);
  }, []);

  return (
    <div
      className="vertify-container"
      style={{ width: imgW }}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      <div className="img-container" style={{ width: imgW, height: imgH }}>
        <canvas ref={canvasRef} width={imgW} height={imgH}></canvas>
        <canvas
          ref={blockRef}
          className="block"
          width={imgW}
          height={imgH}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        ></canvas>
        {status === 'loading' ? <div className={`status ${status}`}></div> : null}
        {['pending', 'failed'].includes(status) ? (
          <div className="refresh" onClick={initSlidePane}></div>
        ) : null}
      </div>
      <div className="slide-bar noselect" unselectable="on">
        {message}
        <div
          className={`fill ${status}`}
          ref={fillRef}
          style={fillDefaultColor ? { backgroundColor: fillDefaultColor } : {}}
        ></div>
        <div
          className={`square ${status}`}
          ref={squareRef}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        ></div>
      </div>
    </div>
  );
};

export default ClientSlideVertify;
