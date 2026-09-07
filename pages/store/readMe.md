# react-loading-skeleton

`react-loading-skeleton` is a lightweight React component for creating customizable loading placeholders (skeleton screens) while your content is loading.

## Installation

```bash
npm install react-loading-skeleton
# or
yarn add react-loading-skeleton
```

## Basic Usage

```jsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function MyComponent({ isLoading, data }) {
    return (
        <div>
            {isLoading ? (
                <Skeleton height={30} width={200} />
            ) : (
                <span>{data}</span>
            )}
        </div>
    );
}
```

## Features

- **Customizable**: Adjust height, width, count, border radius, and more.
- **Theming**: Use `SkeletonTheme` to set global styles.
- **Supports Lists**: Render multiple skeletons with the `count` prop.

## Theming Example

```jsx
import { SkeletonTheme } from 'react-loading-skeleton';

<SkeletonTheme baseColor="#eee" highlightColor="#f5f5f5">
    <Skeleton count={3} />
</SkeletonTheme>
```

## Common Props

| Prop           | Type    | Description                        |
|----------------|---------|------------------------------------|
| `height`       | number  | Height of the skeleton             |
| `width`        | number  | Width of the skeleton              |
| `count`        | number  | Number of skeleton lines           |
| `circle`       | boolean | Makes the skeleton circular        |
| `borderRadius` | number  | Border radius of the skeleton      |
| `inline`       | boolean | Display skeleton inline            |

## More Information

- [GitHub Repository](https://github.com/dvtng/react-loading-skeleton)
- [Documentation](https://www.npmjs.com/package/react-loading-skeleton)
