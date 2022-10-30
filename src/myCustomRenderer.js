import ReactReconciler from 'react-reconciler';
import * as Tone from 'tone'
const mapDOMToTone = {
  div: "C4",
  img: "E4",
  p:"G4"
}
const notes = []
window['play'] = () => {
   const synth = new Tone.Synth().toDestination()

   new Tone.Sequence((time, note) => {
     synth.triggerAttackRelease(note, 0.1, time);

   }, notes).start(0)
   Tone.Transport.start()
}

window['stop'] = () => {
  Tone.Transport.stop()
}
const hostConfig = {  
  getRootHostContext: () => {},
  prepareForCommit: () => {},
  resetAfterCommit: () => {},
  getChildHostContext: () => {},
  shouldSetTextContent: () => {},
  /**
   This is where react-reconciler wants to create an instance of UI element in terms of the target. Since our target here is the DOM, we will create document.createElement and type is the argument that contains the type string like div or img or h1 etc. The initial values of domElement attributes can be set in this function from the newProps argument
   */
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    notes.push(mapDOMToTone[type])
    const domElement = document.createElement(type);
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'className') {
        domElement.setAttribute('class', propValue);
      } else {
      const propValue = newProps[propName];
        domElement.setAttribute(propName, propValue);
      }
    });
    return domElement;
  },
  /* Same as createInstance, but for text nodes. If your renderer doesn't support text nodes, you can throw here. */
  createTextInstance: text => {
   return document.createTextNode(text);
  },
  /*
    This method should mutate the parentInstance and add the child to its list of children. For example, in the DOM this would translate to a parentInstance.appendChild(child) call.
    This method happens in the render phase. It can mutate parentInstance and child, but it must not modify any other nodes. It's called while the tree is still being built up and not connected to the actual tree on the screen.
  */
  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },

  
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  finalizeInitialChildren: (domElement, type, props) => {},
  supportsMutation: true,
  appendChildToContainer: (parent, child) => {
    parent.appendChild(child);
  },
  
};
const ReactReconcilerInst = ReactReconciler(hostConfig);
const MyCustomRenderer = {
  render: (reactElement, domElement, callback) => {
    /* Create a root Container if it doesnt exist */
    if (!domElement._rootContainer) {
      domElement._rootContainer = ReactReconcilerInst.createContainer(domElement, false);
    }

    /* update the root Container */
    return ReactReconcilerInst.updateContainer(reactElement, domElement._rootContainer, null, callback);
  }
};
export default MyCustomRenderer