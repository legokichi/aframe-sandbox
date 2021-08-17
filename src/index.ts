import xs, { Stream } from 'xstream';
import { VNode } from 'snabbdom/vnode';
import fromEvent from 'xstream/extra/fromEvent';
import { run } from '@cycle/run';
import { h, makeDOMDriver, MainDOMSource } from '@cycle/dom';
import * as AFRAME from "aframe";
import "aframe-dev-components";
import "aframe-teleport-controls";

interface Sources {
  DOM: MainDOMSource;
}

interface Sinks {
  DOM: Stream<VNode>;
}

function main(sources: Sources): Sinks {
  AFRAME.registerComponent("input-listener", {
    init() {
      console.log(this);
      // location.reload(true);
    },
    tick() { },
  });



  //   <a-entity axis>
  //     <a-box bb axis class="collidable" position="-0.3 1 0" rotation="0 0 0" width="0.2" height="0.2" depth="0.2"
  //       color="#333333"></a-box>
  //     <a-box bb axis class="collidable" position="0.6 1 0" rotation="0 0 0" width="0.2" height="0.2" depth="0.2"
  //       color="#D75647"></a-box>
  //     <a-box bb axis class="collidable" position="0.9 1 0" rotation="0 0 0" width="0.2" height="0.2" depth="0.2"
  //       color="#8ADE5C"></a-box>
  //     <a-sphere bb axis class="collidable" position="-0.3 1.5 0" rotation="0 0 0" radius="0.2" color="#333333">
  //     </a-sphere>
  //     <a-sphere bb axis class="collidable" position="0.6 1.5 0" rotation="0 0 0" radius="0.2" color="#D75647">
  //     </a-sphere>
  //     <a-sphere bb axis class="collidable" position="0.9 1.5 0" rotation="0 0 0" radius="0.2" color="#8ADE5C">
  //     </a-sphere>
  //     <a-plane bb axis rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
  //   </a-entity>
    

  const input$ = sources.DOM.select('.field').events('abuttondown')

  const vdom$ = xs.of(0).map((_ev) => {
    return h('a-scene', [
      h("a-sky", { attrs: {color: "#333" }}),
      h("a-plane", { attrs: {bb:true, axis:true, rotation: "-90 0 0", width: "4", height: "4", color: "#7BC8A4"}}),
      h("a-entity", {attrs: {id: "cameraRig" }}, [
        h("a-entity", {attrs: {id: "head", camera: true, look_controls: true, position:"0 1.6 0" }}),
        h("a-entity", {attrs: {id: "left-hand", laser_controls: "hand: left", input_listener: true }}),
        h("a-entity", {attrs: {id: "right-hand", laser_controls: "hand: right", input_listener: true }}),
      ]),
      // <!-- teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head; startEvents: teleportstart; endEvents: teleportend" -->
      // <!-- teleport-controls="cameraRig: #cameraRig; teleportOrigin: #head; startEvents: teleportstart; endEvents: teleportend" -->
    ]);
  });
  return { DOM: vdom$ }
}
document.addEventListener("DOMContentLoaded", (_ev) => {
  run(main, {
    DOM: makeDOMDriver('#main-container')
  });
});
