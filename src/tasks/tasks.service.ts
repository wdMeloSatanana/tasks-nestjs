import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { Repository } from 'typeorm';
import { create } from 'domain';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  //
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // getTasksWithFilter(filterDTO: GetTaskFilterDto): Task[] {
  //   const { status, search } = filterDTO;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }
  //   return tasks;
  // }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOneBy({ id });

    if (!found) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    //console.log(found);
    return found;
  }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id == id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with ID ${id} not found`);
  //   }
  //   return found;
  // }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    console.log('Task DTO ', createTaskDto);
    return await this.taskRepository.save({
      title,
      description,
      status: TaskStatus.OPEN,
    });
  }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   //console.log(task);
  //   this.tasks.push(task);
  //   return task;
  // }

  async deleteTask(id: number): Promise<Task> {
    const task = await this.getTaskById(id);
    console.log('task', task.id);
    //return task;
    await this.taskRepository.delete(task.id);
    return task;
  }

  // deleteTask(id: string): Task {
  //   const deletedTask = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task !== deletedTask);
  //   return deletedTask;
  // }
  // editTaskStatus(id: string, status: TaskStatus): Task {
  //   const taskToEdit = this.getTaskById(id);
  //   taskToEdit.status = status;
  //   return taskToEdit;
  // }
}
