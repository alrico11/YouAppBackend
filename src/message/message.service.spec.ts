import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

describe('MessageService', () => {
  let service: MessageService;
  let rabbitMQService: RabbitMQService;
  let model: Model<Message>;

  const mockModel = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockRabbitMQService = {
    connect: jest.fn(),
    closeConnection: jest.fn(),
    sendMessage: jest.fn(),
    sendViewedMessages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: RabbitMQService, useValue: mockRabbitMQService },
        { provide: getModelToken(Message.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
    model = module.get<Model<Message>>(getModelToken(Message.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send message and return data', async () => {
    const createMessageDto: CreateMessageDto = {
      to: 'recipient',
      content: 'Hello, recipient!',
    };
    const username = 'sender';

    await service.sendMessage(username, createMessageDto);

    expect(mockModel.create).toHaveBeenCalledWith({
      from: username,
      to: createMessageDto.to,
      content: createMessageDto.content,
    });
    expect(mockRabbitMQService.connect).toHaveBeenCalled();
    expect(mockRabbitMQService.sendMessage).toHaveBeenCalled();
    expect(mockRabbitMQService.closeConnection).toHaveBeenCalled();
  });

  it('should view messages by user ID and send viewed messages', async () => {
    const username = 'user';

    const messages = [{ from: 'sender', to: username, content: 'Hello, user!' }];
    mockModel.find.mockResolvedValue(messages);

    await service.viewMessageByUserId(username);

    expect(mockModel.find).toHaveBeenCalledWith({
      $or: [{ from: username }, { to: username }],
    });
    expect(mockRabbitMQService.connect).toHaveBeenCalled();
    expect(mockRabbitMQService.sendViewedMessages).toHaveBeenCalledWith(messages);
    expect(mockRabbitMQService.closeConnection).toHaveBeenCalled();
  });
});
