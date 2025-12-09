# DOM Modification via React Portals

Modify existing DOM elements without changing their source code using `createPortal`.

## Pattern

```tsx
"use client"

import { ReactPortal, useLayoutEffect, useState } from "react"
import { createPortal } from "react-dom"

const MyComponent = () => {
  const [portal, setPortal] = useState<ReactPortal | null>(null)

  useLayoutEffect(() => {
    const target = document.getElementById("target-element-id")
    if (!target) return

    // Clear existing content
    target.textContent = ""
    // Or remove specific child: target.removeChild(childNode)

    setPortal(createPortal(<NewContent />, target))
  }, [])

  return <>{portal}</>
}
```

## Steps

1. **Get target element** — `document.getElementById("id")`
2. **Clear children** — `textContent = ""` (all) or `removeChild()` (specific)
3. **Create portal** — `createPortal(<Component />, targetElement)`
4. **Render portal** — Return it from your component

## Why `useLayoutEffect`?

Runs synchronously after DOM mutations but before paint, preventing visual flicker when replacing content.

## File Organization

Each modification should be in its own file inside `components/mwai/` (create the folder if it doesn't exist). This keeps modifications isolated and easy to enable/disable independently.

