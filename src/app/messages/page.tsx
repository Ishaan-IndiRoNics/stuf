import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { conversations, messages, currentUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { SendHorizonal, Search } from 'lucide-react';

export default function MessagesPage() {
  const activeConversation = conversations[0];

  return (
    <div className="h-[calc(100vh-4rem-1px)] grid md:grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]">
      {/* Conversation List */}
      <div className="hidden md:flex flex-col border-r h-full">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold font-headline">Messages</h1>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            {conversations.map((convo, index) => (
              <button
                key={convo.id}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-accent',
                  index === 0 && 'bg-accent'
                )}
              >
                <Avatar>
                  <AvatarImage src={convo.user.avatarUrl} alt={convo.user.name} />
                  <AvatarFallback>{convo.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-baseline justify-between">
                    <p className="font-semibold truncate">{convo.user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {convo.timestamp}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {convo.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat View */}
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar>
             <AvatarImage src={activeConversation.user.avatarUrl} alt={activeConversation.user.name} />
             <AvatarFallback>{activeConversation.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold font-headline">{activeConversation.user.name}</h2>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === 'You' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender !== 'You' && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={activeConversation.user.avatarUrl} alt={activeConversation.user.name} />
                     <AvatarFallback>{activeConversation.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs lg:max-w-md rounded-lg px-4 py-2',
                    msg.sender === 'You'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className="text-xs text-right mt-1 opacity-70">{msg.timestamp}</p>
                </div>
                 {msg.sender === 'You' && (
                  <Avatar className="h-8 w-8">
                     <AvatarImage src={currentUser.avatarUrl} alt="You" />
                     <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form className="relative">
            <Input
              placeholder="Type a message..."
              className="pr-12"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
