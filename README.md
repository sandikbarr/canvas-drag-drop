# Canvas Drag and Drop

## Example project that renders images on an HTML canvas
- Canvas maintains a 16:9 aspect ration on resize
- Images can be moved around the canvas with the mouse, i.e. drag and drop
    - Images cannot be moved outside the canvas
    - When being moved, images have a 2px green border
    - Images can be moved together if dragged from overlapping position

## Running the project
- Open the project [here on github](https://sandikbarr.github.io/canvas-drag-drop/)
- Or clone it and run it locally with any http server, such as
```
python -m SimpleHTTPServer
```

## Limitations:
- Images are initially rendered horizontally at their original size regardless of available space
- If image ends up outside canvas boundaries due to size limitations or resizing, pulling it back in is jerky at best
- Performance is choppy

## Feedback and Notes
- Time investment? 4-5 hours over a weekend
- Most challenging? very open ended, still needs improvement, but limited by time
- Anything unclear? How much effort and polish is expected.
- Technical decisions:
  - Keep it simple: Being unfamiliar with the canvas API, I started writing some JavaScript and just stuck with it.
  - State: Maintain image position and mouse drag state to redraw images on canvas when moved
