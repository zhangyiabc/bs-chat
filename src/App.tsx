import { Bubble, Conversations, Prompts, Sender, Welcome, useXAgent, useXChat, Suggestion } from '@ant-design/x';
import { createStyles } from 'antd-style';
import React, { useEffect } from 'react';
import { Avatar } from './components';
import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  SmileOutlined,
  OpenAIOutlined,
  UserOutlined
} from '@ant-design/icons';
import { type GetProp, Space, Popover } from 'antd';
import './App.scss';

const renderTitle = (icon: React.ReactElement, title: string) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);


const defaultConversationsItems = [
  {
    key: '0',
    label: '我的会话',
  },
];

const useStyle = createStyles(({ token, css }) => {
  return {
    layout: css`
      width: 100%;
      min-width: 1000px;
      height: 100vh;
      border-radius: ${token.borderRadius}px;
      display: flex;
      background: ${token.colorBgContainer};
      font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;

      .ant-prompts {
        color: ${token.colorText};
      }
    `,
    menu: css`
      background: ${token.colorBgLayout}80;
      width: 280px;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 18px 12px;
      box-sizing: border-box;
    `,
    conversations: css`
      padding: 0 12px;
      flex: 1;
      overflow-y: auto;
    `,
    chat: css`
      height: 100%;
      width: 100%;
      max-width: 700px;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding: ${token.paddingLG}px;
      gap: 16px;
    `,
    messages: css`
      flex: 1;
    `,
    placeholder: css`
      padding-top: 32px;
    `,
    sender: css`
      box-shadow: ${token.boxShadow};
    `,
    logo: css`
      display: flex;
      height: 72px;
      align-items: center;
      justify-content: start;
      padding: 0 24px;
      box-sizing: border-box;

      img {
        width: 24px;
        height: 24px;
        display: inline-block;
      }

      span {
        display: inline-block;
        margin: 0 8px;
        font-weight: bold;
        color: ${token.colorText};
        font-size: 16px;
      }
    `,
    addBtn: css`
      background: #1677ff0f;
      border: 1px solid #1677ff34;
      width: calc(100% - 24px);
      margin: 0 12px 24px 12px;
    `,
  };
});

const placeholderPromptsItems: GetProp<typeof Prompts, 'items'> = [
  {
    key: '1',
    label: renderTitle(<FireOutlined style={{ color: '#FF4D4F' }} />, '热词'),
    description: '你对什么感兴趣?',
    children: [
      {
        key: '1-1',
        description: `什么是大模型?`,
      },
      {
        key: '1-2',
        description: `什么是AGI?`,
      },
      {
        key: '1-3',
        description: `什么是agent?`,
      },
    ],
  },
  {
    key: '2',
    label: renderTitle(<ReadOutlined style={{ color: '#1890FF' }} />, 'Design Guide'),
    description: 'How to design a good product?',
    children: [
      {
        key: '2-1',
        icon: <HeartOutlined />,
        description: `Know the well`,
      },
      {
        key: '2-2',
        icon: <SmileOutlined />,
        description: `Set the AI role`,
      },
      {
        key: '2-3',
        icon: <CommentOutlined />,
        description: `Express the feeling`,
      },
    ],
  },
];

const roles: GetProp<typeof Bubble.List, 'roles'> = {
  ai: {
    placement: 'start',
    typing: { step: 5, interval: 20 },
    styles: {
      content: {
        borderRadius: 16,
      },
    },
  },
  local: {
    placement: 'end',
    variant: 'shadow',
  },
};

type SuggestionItems = Exclude<GetProp<typeof Suggestion, 'items'>, () => void>;

const suggestions: SuggestionItems = [
  { label: '唐纳德·特朗普', value: 'trump' },
  { label: '前端专家', value: 'front' },
];
const Independent: React.FC = () => {
  // ==================== Style ====================
  const { styles } = useStyle();

  const [content, setContent] = React.useState('');

  const [conversationsItems, setConversationsItems] = React.useState(defaultConversationsItems);

  const [activeKey, setActiveKey] = React.useState(defaultConversationsItems[0].key);

  // ==================== Runtime ====================
  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess }) => {
      onSuccess(`Mock success return. You said: ${message}`);
    },
  });

  const { onRequest, messages, setMessages } = useXChat({
    agent,
  });

  useEffect(() => {
    if (activeKey !== undefined) {
      setMessages([]);
    }
  }, [activeKey]);

  // ==================== Event ====================
  const onSubmit = (nextContent: string) => {
    if (!nextContent) return;
    onRequest(nextContent);
    setContent('');
  };

  const onPromptsItemClick: GetProp<typeof Prompts, 'onItemClick'> = info => {
    onRequest(info.data.description as string);
  };

  const onConversationClick: GetProp<typeof Conversations, 'onActiveChange'> = key => {
    setActiveKey(key);
  };

  // ==================== Nodes ====================
  const placeholderNode = (
    <Space direction="vertical" size={16} className={styles.placeholder}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="你好！我是你的贴心AI小助手"
        description="广泛的知识储备，为您提供清晰、易懂的回答和解释"
      />
      <Prompts
        title="您想要询问什么?"
        items={placeholderPromptsItems}
        styles={{
          list: {
            width: '100%',
          },
          item: {
            flex: 1,
          },
        }}
        onItemClick={onPromptsItemClick}
      />
    </Space>
  );

  const items: GetProp<typeof Bubble.List, 'items'> = messages.map(({ id, message, status }) => ({
    key: id,
    loading: status === 'loading',
    role: status === 'local' ? 'local' : 'ai',
    content: message,
  }));

  const logoNode = (
    <div className={styles.logo}>
      <img
        src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
        draggable={false}
        alt="logo"
      />
      <span>Ant Design X</span>
    </div>
  );

  const renderPopoverContent = () => {
    return <div className="popover-info-wrapper">
      <div className="popover-info-item">
        <div className="item-icon"><OpenAIOutlined /></div>
        <div className="item-test">我的token</div>
      </div>
      <div className="popover-info-item">
        <div className="item-icon"><UserOutlined /></div>
        <div className="item-test">我的信息</div>
      </div>
    </div>
  }

  // ==================== Render =================
  return (
    <div className={styles.layout}>
      <div className={styles.menu}>
        {/* 🌟 Logo */}
        {logoNode}
        {/* 🌟 添加会话 */}
        {/* <Button
          onClick={onAddConversation}
          type="link"
          className={styles.addBtn}
          icon={<PlusOutlined />}
        >
          New Conversation
        </Button> */}
        {/* 🌟 会话管理 */}
        <Conversations
          items={conversationsItems}
          className={styles.conversations}
          activeKey={activeKey}
          onActiveChange={onConversationClick}
        />
        <Popover placement="topLeft"  content={renderPopoverContent()} >
          
        <div className="my-info-wrapper">
          <span className="my-info-name">张益达</span>
          <Avatar name="张益达" />
        </div>
        </Popover>
      </div>
      <div className={styles.chat}>
        {/* 🌟 消息列表 */}
        <Bubble.List
          items={items.length > 0 ? items : [{ content: placeholderNode, variant: 'borderless' }]}
          roles={roles}
          className={styles.messages}
        />
        {/* 🌟 提示词 */}
        {/* <Prompts items={senderPromptsItems} onItemClick={onPromptsItemClick} /> */}
        {/* 🌟 输入框 */}
        <Suggestion
          items={suggestions}
          onSelect={itemVal => {
            setContent(`[${itemVal}]:`);
          }}
        >
          {({ onTrigger, onKeyDown }) => {
            return (
              <Sender
                submitType="shiftEnter"
                value={content}
                onSubmit={onSubmit}
                onChange={nextVal => {
                  if (nextVal === '/') {
                    onTrigger();
                  } else if (!nextVal) {
                    onTrigger(false);
                  }
                  setContent(nextVal);
                }}
                onKeyDown={onKeyDown}
                loading={agent.isRequesting()}
                className={styles.sender}
                placeholder="输入 / 获取建议"
              />
            );
          }}
        </Suggestion>
      </div>
    </div>
  );
};

export default Independent;
