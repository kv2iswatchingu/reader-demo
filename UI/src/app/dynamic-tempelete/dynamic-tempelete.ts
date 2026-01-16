import { Component, ComponentFactoryResolver, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dynamic-tempelete',
  imports: [],
  templateUrl: './dynamic-tempelete.html',
  styleUrl: './dynamic-tempelete.scss'
})
export class DynamicTempelete {

  @ViewChild('target', { read: ViewContainerRef })

  formContainer: ViewContainerRef | undefined;//用来创建等对组件进行相关操作的
  public formContainerRef: ComponentRef<any> | undefined; // 通过formContainer调用相关api创建出来的组件容器
  public isLoading = true;
  public hasMask: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.route.snapshot.component);
    this.formContainerRef = this.formContainer?.createComponent(componentFactory);
    this.isLoading = false;
  }

  
}
