import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  progress: number;
  pages: number;
  currentPage: number;
  category: string;
  rating: number;
}

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'https://cdn.poehali.dev/projects/b84bf3a6-28c5-420c-bf23-634868769a73/files/d36b619d-9bfd-42fa-972a-5767495dd822.jpg',
    progress: 65,
    pages: 304,
    currentPage: 198,
    category: 'Фантастика',
    rating: 4.5,
  },
  {
    id: 2,
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'https://cdn.poehali.dev/projects/b84bf3a6-28c5-420c-bf23-634868769a73/files/92768703-9db7-4114-96a2-265cc61ea4dc.jpg',
    progress: 30,
    pages: 320,
    currentPage: 96,
    category: 'Саморазвитие',
    rating: 5,
  },
  {
    id: 3,
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    cover: 'https://cdn.poehali.dev/projects/b84bf3a6-28c5-420c-bf23-634868769a73/files/8908be2a-7808-47da-8147-7215319351c4.jpg',
    progress: 100,
    pages: 384,
    currentPage: 384,
    category: 'Драма',
    rating: 4.8,
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingSettings, setReadingSettings] = useState({
    fontSize: 18,
    brightness: 100,
    theme: 'sepia',
  });

  const totalPagesRead = mockBooks.reduce((sum, book) => sum + book.currentPage, 0);
  const booksCompleted = mockBooks.filter(b => b.progress === 100).length;
  const currentStreak = 7;

  const renderLibrary = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Моя библиотека</h2>
        <Button variant="ghost" size="icon">
          <Icon name="Plus" size={20} />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockBooks.map((book, index) => (
          <Card
            key={book.id}
            className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => {
              setSelectedBook(book);
              setActiveTab('reader');
            }}
          >
            <div className="flex gap-4">
              <img
                src={book.cover}
                alt={book.title}
                className="w-24 h-32 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {book.category}
                  </Badge>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Прогресс</span>
                    <span>{book.currentPage} / {book.pages} стр.</span>
                  </div>
                  <Progress value={book.progress} className="h-2" />
                </div>

                <div className="flex items-center gap-1 text-sm">
                  {[...Array(5)].map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={14}
                      className={i < Math.floor(book.rating) ? 'fill-primary text-primary' : 'text-muted'}
                    />
                  ))}
                  <span className="ml-1 text-xs text-muted-foreground">{book.rating}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Рекомендации для вас</h3>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-2 hover:shadow-md transition-shadow cursor-pointer">
              <div className="aspect-[2/3] bg-muted rounded-md mb-2" />
              <p className="text-xs font-medium line-clamp-1">Новая книга</p>
              <p className="text-xs text-muted-foreground line-clamp-1">Автор</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReader = () => {
    if (!selectedBook) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <Icon name="BookOpen" size={64} className="text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Выберите книгу для чтения</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={() => setSelectedBook(null)}>
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Icon name="Bookmark" size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h1 className="text-3xl font-bold text-foreground">{selectedBook.title}</h1>
          <p className="text-muted-foreground">{selectedBook.author}</p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Глава 12</span>
            <span>•</span>
            <span>{selectedBook.currentPage} / {selectedBook.pages}</span>
            <span>•</span>
            <span>~15 мин</span>
          </div>
        </div>

        <Card className="p-6">
          <ScrollArea className="h-[400px]">
            <div className="space-y-4 text-foreground leading-relaxed" style={{ fontSize: `${readingSettings.fontSize}px` }}>
              <p>
                В тот момент, когда она открыла глаза, первое, что она увидела, был мягкий свет, 
                проникающий сквозь занавески. Комната была наполнена спокойствием утра, 
                и казалось, что время замедлило свой бег.
              </p>
              <p>
                Она медленно встала с кровати, чувствуя, как её ноги касаются прохладного пола. 
                За окном слышалось пение птиц — мелодия, которая всегда напоминала ей о детстве, 
                о тех беззаботных летних днях на берегу озера.
              </p>
              <p>
                Подойдя к окну, она отодвинула занавеску. Солнце поднималось над горизонтом, 
                окрашивая небо в тёплые оттенки оранжевого и розового. Это был тот момент, 
                когда всё казалось возможным, когда день обещал новые открытия и маленькие радости.
              </p>
              <p>
                С чашкой горячего чая в руках она села у окна, наслаждаясь тишиной и покоем. 
                В такие моменты она понимала, что счастье — это не громкие события, 
                а эти тихие минуты наедине с собой, когда душа находит своё равновесие.
              </p>
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Размер шрифта</span>
              <span className="text-foreground font-medium">{readingSettings.fontSize}px</span>
            </div>
            <Slider
              value={[readingSettings.fontSize]}
              onValueChange={(value) => setReadingSettings({ ...readingSettings, fontSize: value[0] })}
              min={14}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            {['light', 'sepia', 'dark'].map((theme) => (
              <Button
                key={theme}
                variant={readingSettings.theme === theme ? 'default' : 'outline'}
                size="sm"
                onClick={() => setReadingSettings({ ...readingSettings, theme })}
                className="flex-1 capitalize"
              >
                {theme === 'light' ? 'Светлая' : theme === 'sepia' ? 'Сепия' : 'Тёмная'}
              </Button>
            ))}
          </div>
        </Card>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Icon name="ChevronLeft" size={16} className="mr-2" />
            Назад
          </Button>
          <Button className="flex-1">
            Вперёд
            <Icon name="ChevronRight" size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderCatalog = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Каталог</h2>
        
        <div className="relative">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск книг, авторов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {['Все', 'Фантастика', 'Детектив', 'Саморазвитие', 'Классика', 'Бизнес'].map((category) => (
            <Badge
              key={category}
              variant={category === 'Все' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-primary/10 transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {mockBooks.map((book, index) => (
          <Card
            key={book.id}
            className="p-3 hover:shadow-lg transition-all cursor-pointer animate-scale-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-full aspect-[2/3] object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-foreground">{book.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{book.author}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon name="Star" size={12} className="fill-primary text-primary" />
                <span className="text-xs font-medium">{book.rating}</span>
              </div>
              <Badge variant="secondary" className="text-xs">{book.category}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="" />
          <AvatarFallback className="text-2xl bg-primary/10">АП</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Анна Петрова</h2>
          <p className="text-muted-foreground">Активный читатель</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{booksCompleted}</div>
          <div className="text-xs text-muted-foreground">Прочитано книг</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{totalPagesRead}</div>
          <div className="text-xs text-muted-foreground">Страниц</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-primary mb-1">{currentStreak}</div>
          <div className="text-xs text-muted-foreground">Дней подряд</div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold mb-4 text-foreground">Цель на месяц</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">3 из 5 книг</span>
            <span className="font-medium text-foreground">60%</span>
          </div>
          <Progress value={60} className="h-3" />
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-4 text-foreground">Активность по дням</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
            <div key={day} className="text-center">
              <div className="text-xs text-muted-foreground mb-2">{day}</div>
              <div
                className={`h-10 rounded-md ${
                  i < 5 ? 'bg-primary' : 'bg-muted'
                } transition-all hover:scale-105`}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-4 text-foreground">Любимые жанры</h3>
        <div className="space-y-3">
          {[
            { genre: 'Фантастика', count: 12, percentage: 40 },
            { genre: 'Саморазвитие', count: 8, percentage: 27 },
            { genre: 'Драма', count: 7, percentage: 23 },
            { genre: 'Детектив', count: 3, percentage: 10 },
          ].map((item) => (
            <div key={item.genre} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.genre}</span>
                <span className="text-muted-foreground">{item.count} книг</span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-card min-h-screen shadow-xl">
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm border-b border-border z-10 p-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-foreground">Cozy Reader</h1>
            <Button variant="ghost" size="icon">
              <Icon name="Bell" size={20} />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">Ваш уютный уголок для чтения</p>
        </div>

        <div className="p-4 pb-24">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="library" className="flex items-center gap-1 text-xs">
                <Icon name="Library" size={16} />
                <span className="hidden sm:inline">Библиотека</span>
              </TabsTrigger>
              <TabsTrigger value="reader" className="flex items-center gap-1 text-xs">
                <Icon name="BookOpen" size={16} />
                <span className="hidden sm:inline">Чтение</span>
              </TabsTrigger>
              <TabsTrigger value="catalog" className="flex items-center gap-1 text-xs">
                <Icon name="Search" size={16} />
                <span className="hidden sm:inline">Каталог</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-1 text-xs">
                <Icon name="User" size={16} />
                <span className="hidden sm:inline">Профиль</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="mt-0">
              {renderLibrary()}
            </TabsContent>

            <TabsContent value="reader" className="mt-0">
              {renderReader()}
            </TabsContent>

            <TabsContent value="catalog" className="mt-0">
              {renderCatalog()}
            </TabsContent>

            <TabsContent value="profile" className="mt-0">
              {renderProfile()}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
