import { autoBind } from '../decorators/autobind';
import { Draggable } from '../models/drag-drop';
import { Project } from '../models/project';
import Component from './base-component';

export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  get manday() {
    if (this.prjItem.manday < 20) {
      return this.prjItem.manday.toString() + '人日';
    } else {
      return (this.prjItem.manday / 20).toString() + '人月';
    }
  }

  constructor(hostId: string, private prjItem: Project) {
    const { id } = prjItem;
    super('single-project', hostId, false, id);

    this.configure();
    this.renderContent();
  }

  @autoBind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.prjItem.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(_: DragEvent): void {
    console.log('Drag終了');
  }

  configure() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent() {
    const { title, description } = this.prjItem;
    (this.element.querySelector('h2') as HTMLHeadingElement).textContent = title;
    (this.element.querySelector('h3') as HTMLHeadingElement).textContent = this.manday;
    (this.element.querySelector('p') as HTMLParagraphElement).textContent = description;
  }
}
