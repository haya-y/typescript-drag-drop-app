import { autoBind } from '../decorators/autobind';
import { DragTarget } from '../models/drag-drop';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project-state';
import Component from './base-component';
import { ProjectItem } from './project-item';

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  assignedProject: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProject = [];

    this.configure();
    this.renderContent();
  }

  @autoBind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      // TODO: event.preventDefault()で以下のエラーが発生(動作は問題ない)
      // "content.js:1 Uncaught TypeError: t.drop is not a function"
      event.preventDefault();
      const ulElement = this.element.querySelector('ul')!;
      ulElement.classList.add('droppable');
    }
  }

  @autoBind
  dragHandler(event: DragEvent): void {
    const prjId = event.dataTransfer?.getData('text/plain');
    projectState.moveProject(prjId!, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @autoBind
  dragLeaveHandler(_: DragEvent): void {
    const ulElement = this.element.querySelector('ul')!;
    ulElement.classList.remove('droppable');
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dragHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) =>
        this.type === 'active' ? project.status === ProjectStatus.Active : project.status === ProjectStatus.Finished,
      );
      this.assignedProject = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    (this.element.querySelector('ul') as HTMLUListElement).id = listId;
    (this.element.querySelector('h2') as HTMLHeadElement).textContent =
      this.type === 'active' ? '実行中プロジェクト' : '完了プロジェクト';
  }

  private renderProjects() {
    const ulElement = document.getElementById(`${this.type}-projects-list`) as HTMLUListElement;
    ulElement.innerHTML = '';
    for (const prjItem of this.assignedProject) {
      new ProjectItem(ulElement.id, prjItem);
    }
  }
}
