/**
 * 针对 cdk-virtual-scroll-viewport 中加载大量图片（如 12GB、3000+ 图片）导致滚动卡顿的问题，可以尝试以下优化方案：

1. 延迟加载图片（Lazy Loading）
确保图片只在视口内加载，而不是一次性加载所有图片。可以通过 IntersectionObserver 或 Angular 的 *ngIf 来实现。

修改 ui-card 的图片加载逻辑：
 * <ui-card
    *cdkVirtualFor="let file of mainTest; let i = index;"
    [cardData]="file"
    [detailMode]="detailMode"
    [disabled]="editConfig || addConfig"
    [selected]="file.path === configFilePath || imageViewerPath === file.path"
    (cardClick)="showConfig(file)"
    (cardDbClick)="openFolder(file)"
    (contextmenu)="onRightClick($event, file)">
    <img 
        *ngIf="isVisible(i)" 
        [src]="file.path" 
        alt="Image"
        class="lazy-loaded-image" />
</ui-card>
 * 在组件中添加 isVisible 方法

visibleIndexes = new Set<number>();

isVisible(index: number): boolean {
    return this.visibleIndexes.has(index);
}

onScrolledIndexChange(index: number): void {
    const buffer = 10; // 缓冲区大小
    this.visibleIndexes.clear();
    for (let i = index - buffer; i <= index + buffer; i++) {
        if (i >= 0 && i < this.mainTest.length) {
            this.visibleIndexes.add(i);
        }
    }
}

<cdk-virtual-scroll-viewport 
    itemSize="220"
    (scrolledIndexChange)="onScrolledIndexChange($event)"
    class="reader-homepage-viewport">
    ...
</cdk-virtual-scroll-viewport>
2. 使用缩略图（Thumbnails）
加载图片时，优先加载低分辨率的缩略图，用户需要时再加载高清图片。

在图片路径中添加缩略图逻辑：

getThumbnailPath(filePath: string): string {
    return filePath.replace(/(\.\w+)$/, '_thumb$1'); // 假设缩略图命名规则为 "原图名_thumb.扩展名"
}
    <img 
    *ngIf="isVisible(i)" 
    [src]="getThumbnailPath(file.path)" 
    (click)="loadFullImage(file.path)" 
    alt="Thumbnail"
    class="lazy-loaded-thumbnail" />
    <cdk-virtual-scroll-viewport 
    itemSize="220"
    minBufferPx="440"
    maxBufferPx="880"
    (scrolledIndexChange)="onScrolledIndexChange($event)"
    class="reader-homepage-viewport">
    ...
</cdk-virtual-scroll-viewport>



4. 启用 Web Worker
Web Worker 可以将图片的预处理（如缩略图生成、解码等）放到单独的线程中，避免阻塞主线程，从而提升页面的流畅度。

实现步骤：
创建 Web Worker 文件： 新建一个文件 image-worker.ts，用于处理图片的预处理逻辑。
// filepath: e:\codeSourse\reader\reader-demo-1\UI\src\workers\image-worker.ts
addEventListener('message', ({ data }) => {
    const { imagePath } = data;
    // 模拟图片处理逻辑，例如生成缩略图
    const processedImage = imagePath; // 这里可以加入实际的处理逻辑
    postMessage({ processedImage });
});
在组件中使用 Web Worker： 在组件中引入 Web Worker，并将图片处理任务交给它。

// filepath: e:\codeSourse\reader\reader-demo-1\UI\src\core\pages\homepage\homepage.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.html',
    styleUrls: ['./homepage.css']
})
export class HomepageComponent implements OnInit {
    private worker: Worker;

    ngOnInit(): void {
        if (typeof Worker !== 'undefined') {
            this.worker = new Worker(new URL('../../workers/image-worker.ts', import.meta.url));
            this.worker.onmessage = ({ data }) => {
                console.log('Processed Image:', data.processedImage);
                // 更新图片路径或状态
            };
        }
    }

    processImage(imagePath: string): void {
        if (this.worker) {
            this.worker.postMessage({ imagePath });
        }
    }

    ngOnDestroy(): void {
        if (this.worker) {
            this.worker.terminate();
        }
    }
}GitHub Copilot
以下是针对您提到的优化方案的具体说明和实现方式：

4. 启用 Web Worker
Web Worker 可以将图片的预处理（如缩略图生成、解码等）放到单独的线程中，避免阻塞主线程，从而提升页面的流畅度。

实现步骤：
创建 Web Worker 文件： 新建一个文件 image-worker.ts，用于处理图片的预处理逻辑。

在组件中使用 Web Worker： 在组件中引入 Web Worker，并将图片处理任务交给它。

在模板中调用： 在图片加载时调用 processImage 方法。
<img 
    *ngIf="isVisible(i)" 
    [src]="file.path" 
    (load)="processImage(file.path)" 
    alt="Image"
    class="lazy-loaded-image" />
    6. 分页加载
分页加载可以减少一次性加载的图片数量，用户滚动到一定位置时再加载下一批数据。

实现步骤：
修改数据加载逻辑： 在组件中实现分页逻辑。// filepath: e:\codeSourse\reader\reader-demo-1\UI\src\core\pages\homepage\homepage.component.ts
currentPage = 0;
pageSize = 100; // 每页加载 100 张图片
paginatedGroups = [];

loadNextPage(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const nextPage = this.groups.slice(start, end);
    this.paginatedGroups = [...this.paginatedGroups, ...nextPage];
    this.currentPage++;
}

onScrolledIndexChange(index: number): void {
    const buffer = 10; // 缓冲区
    if (index + buffer >= this.paginatedGroups.length) {
        this.loadNextPage();
    }
}GitHub Copilot
以下是针对您提到的优化方案的具体说明和实现方式：

4. 启用 Web Worker
Web Worker 可以将图片的预处理（如缩略图生成、解码等）放到单独的线程中，避免阻塞主线程，从而提升页面的流畅度。

实现步骤：
创建 Web Worker 文件： 新建一个文件 image-worker.ts，用于处理图片的预处理逻辑。

在组件中使用 Web Worker： 在组件中引入 Web Worker，并将图片处理任务交给它。

在模板中调用： 在图片加载时调用 processImage 方法。

6. 分页加载
分页加载可以减少一次性加载的图片数量，用户滚动到一定位置时再加载下一批数据。

实现步骤：
修改数据加载逻辑： 在组件中实现分页逻辑。

绑定滚动事件： 在模板中绑定 scrolledIndexChange 事件。<cdk-virtual-scroll-viewport 
    itemSize="220"
    (scrolledIndexChange)="onScrolledIndexChange($event)"
    class="reader-homepage-viewport"> 
    <div 
        #group
        style="display: flex; height: 220px; gap: 8px"
        *cdkVirtualFor="let group of paginatedGroups; let i = index;">
        @for (file of group; track file.path) {
            <ui-card
                [cardData]="file"
                [detailMode]="detailMode"
                [disabled]="editConfig || addConfig"
                [selected]="file.path === configFilePath || imageViewerPath === file.path"
                (cardClick)="showConfig(file)"
                (cardDbClick)="openFolder(file)"
                (contextmenu)="onRightClick($event,file)">
            </ui-card>
        }
    </div>GitHub Copilot
以下是针对您提到的优化方案的具体说明和实现方式：

4. 启用 Web Worker
Web Worker 可以将图片的预处理（如缩略图生成、解码等）放到单独的线程中，避免阻塞主线程，从而提升页面的流畅度。

实现步骤：
创建 Web Worker 文件： 新建一个文件 image-worker.ts，用于处理图片的预处理逻辑。

在组件中使用 Web Worker： 在组件中引入 Web Worker，并将图片处理任务交给它。

在模板中调用： 在图片加载时调用 processImage 方法。

6. 分页加载
分页加载可以减少一次性加载的图片数量，用户滚动到一定位置时再加载下一批数据。

实现步骤：
修改数据加载逻辑： 在组件中实现分页逻辑。

绑定滚动事件： 在模板中绑定 scrolledIndexChange 事件。

8. 使用图片懒加载库
使用第三方库（如 ngx-lazy-load-images）可以简化懒加载逻辑。

实现步骤：
安装库： 在项目中安装 ngx-lazy-load-images。npm install ngx-lazy-load-imagesimport { LazyLoadImageModule } from 'ngx-lazy-load-images';

@NgModule({
    declarations: [...],
    imports: [
        ...,
        LazyLoadImageModule
    ],
    bootstrap: [...]
})
export class AppModule { }<img 
    *ngIf="isVisible(i)" 
    [defaultImage]="'assets/placeholder.png'" 
    [lazyLoad]="file.path" 
    alt="Image"
    class="lazy-loaded-image" />


    在 Windows 系统中，文件夹显示图片时，通常会通过以下方式处理图片，而不需要生成缩略图：

1. 使用文件系统缓存
Windows 系统会自动为文件夹中的图片生成缩略图，并将这些缩略图缓存到 thumbs.db 文件中（在旧版本的 Windows 中）或存储在系统的缩略图缓存中（如 Windows 10/11）。这种方式避免了每次打开文件夹时重新生成缩略图。

如果你不希望生成缩略图，可以直接加载图片的原始文件路径，但需要注意性能问题。

2. 直接加载图片
Windows 文件资源管理器在显示图片时，会直接读取图片文件的路径并加载到内存中。如果图片文件较大，加载速度会变慢，尤其是当文件夹中有大量图片时。

在你的场景中，如果不希望生成缩略图，可以直接加载图片路径到前端，但需要优化加载逻辑以避免性能问题。

优化方案（避免生成缩略图）
1. 延迟加载图片
只加载当前视口内的图片，避免一次性加载所有图片。可以通过 cdk-virtual-scroll 的 scrolledIndexChange 事件实现。

2. 分页加载
将图片分批加载到前端，用户滚动到一定位置时再加载下一批数据。

3. 使用懒加载
通过懒加载库（如 ngx-lazy-load-images）简化图片加载逻辑，避免一次性加载所有图片。

4. 限制图片分辨率
直接加载图片时，可以限制图片的分辨率以减少内存占用。例如，使用 CSS 设置最大宽度和高度：

总结onScrolledIndexChange(index: number): void {
    const buffer = 10; // 缓冲区大小
    this.visibleIndexes.clear();
    for (let i = index - buffer; i <= index + buffer; i++) {
        if (i >= 0 && i < this.groups.length) {
            this.visibleIndexes.add(i);
        }
    }
}
如果你不希望生成缩略图，可以直接加载图片路loadNextPage(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    const nextPage = this.groups.slice(start, end);
    this.paginatedGroups = [...this.paginatedGroups, ...nextPage];
    this.currentPage++;<img 
    [defaultImage]="'assets/placeholder.png'" 
    [lazyLoad]="file.path" 
    alt="Image"
    class="lazy-loaded-image" />.lazy-loaded-image {
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
}
}径，但需要通过延迟加载、分页加载和懒加载等方式优化性能，避免一次性加载大量图片导致卡顿。
*/

