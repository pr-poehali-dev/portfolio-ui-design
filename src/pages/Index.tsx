import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
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

interface Bookmark {
  id: number;
  page: number;
  text: string;
  timestamp: string;
}

interface Note {
  id: number;
  page: number;
  text: string;
  note: string;
  timestamp: string;
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: 1, page: 145, text: 'Важный момент в сюжете', timestamp: '2024-11-10T10:30:00' }
  ]);
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, page: 98, text: 'Она медленно встала с кровати...', note: 'Красивое описание утра', timestamp: '2024-11-09T14:20:00' }
  ]);
  const [newNote, setNewNote] = useState('');
  const [selectedText] = useState('');
  const [readingSettings, setReadingSettings] = useState({
    fontSize: 18,
    brightness: 100,
    theme: 'light',
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const totalPagesRead = mockBooks.reduce((sum, book) => sum + book.currentPage, 0);
  const booksCompleted = mockBooks.filter(b => b.progress === 100).length;
  const currentStreak = 7;

  const addBookmark = () => {
    if (!selectedBook) return;
    const newBookmark: Bookmark = {
      id: Date.now(),
      page: selectedBook.currentPage,
      text: 'Закладка на странице ' + selectedBook.currentPage,
      timestamp: new Date().toISOString(),
    };
    setBookmarks([...bookmarks, newBookmark]);
  };

  const addNote = () => {
    if (!newNote || !selectedBook) return;
    const note: Note = {
      id: Date.now(),
      page: selectedBook.currentPage,
      text: selectedText || 'Выделенный текст',
      note: newNote,
      timestamp: new Date().toISOString(),
    };
    setNotes([...notes, note]);
    setNewNote('');
  };

  const renderLibrary = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-3xl font-bold text-foreground">Библиотека</h2>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Icon name="Plus" size={24} />
        </Button>
      </div>

      <div className="space-y-3">
        {mockBooks.map((book, index) => (
          <Card
            key={book.id}
            className="p-4 ios-card border-0 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => {
              setSelectedBook(book);
              setActiveTab('reader');
            }}
          >
            <div className="flex gap-4">
              <div className="relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-lg"
                />
                {book.progress === 100 && (
                  <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">
                    <Icon name="Check" size={14} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-semibold text-base text-foreground">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{book.currentPage} / {book.pages} стр.</span>
                    <span>{book.progress}%</span>
                  </div>
                  <Progress value={book.progress} className="h-1.5" />
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs rounded-full">
                    {book.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Icon name="Star" size={14} className="fill-primary text-primary" />
                    <span className="text-sm font-medium">{book.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <h3 className="text-lg font-semibold mb-3 px-1 text-foreground">Рекомендации</h3>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="flex-shrink-0 w-28 p-2 ios-card border-0 active:scale-95 transition-transform cursor-pointer">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-2" />
                <p className="text-xs font-medium line-clamp-2">Новая книга</p>
                <p className="text-xs text-muted-foreground line-clamp-1">Автор</p>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );

  const renderReader = () => {
    if (!selectedBook) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center py-20">
          <div className="bg-muted rounded-full p-6 mb-4">
            <Icon name="BookOpen" size={48} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-lg">Выберите книгу для чтения</p>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fade-in -mx-4 -mt-4">
        <div className="sticky top-0 ios-blur bg-card/80 border-b border-border z-10 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedBook(null)}
              className="rounded-full active:scale-95 transition-transform"
            >
              <Icon name="ChevronLeft" size={24} />
            </Button>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full active:scale-95 transition-transform relative">
                    <Icon name="Bookmark" size={20} />
                    {bookmarks.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {bookmarks.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
                  <SheetHeader>
                    <SheetTitle>Закладки и заметки</SheetTitle>
                  </SheetHeader>
                  <Tabs defaultValue="bookmarks" className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="bookmarks">Закладки</TabsTrigger>
                      <TabsTrigger value="notes">Заметки</TabsTrigger>
                    </TabsList>
                    <TabsContent value="bookmarks" className="space-y-3 mt-4">
                      {bookmarks.map((bookmark) => (
                        <Card key={bookmark.id} className="p-4 ios-card border-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-sm">Страница {bookmark.page}</p>
                              <p className="text-xs text-muted-foreground mt-1">{bookmark.text}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                      {bookmarks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Icon name="Bookmark" size={32} className="mx-auto mb-2 opacity-50" />
                          <p>Нет закладок</p>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="notes" className="space-y-3 mt-4">
                      {notes.map((note) => (
                        <Card key={note.id} className="p-4 ios-card border-0">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-xs text-muted-foreground">Страница {note.page}</p>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <Icon name="Trash2" size={16} className="text-destructive" />
                            </Button>
                          </div>
                          <p className="text-sm italic text-muted-foreground mb-2">"{note.text}"</p>
                          <p className="text-sm">{note.note}</p>
                        </Card>
                      ))}
                      {notes.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Icon name="StickyNote" size={32} className="mx-auto mb-2 opacity-50" />
                          <p>Нет заметок</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full active:scale-95 transition-transform">
                    <Icon name="Settings" size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-auto rounded-t-3xl">
                  <SheetHeader>
                    <SheetTitle>Настройки чтения</SheetTitle>
                  </SheetHeader>
                  <div className="space-y-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Размер шрифта</span>
                        <span className="text-sm text-muted-foreground">{readingSettings.fontSize}px</span>
                      </div>
                      <Slider
                        value={[readingSettings.fontSize]}
                        onValueChange={(value) => setReadingSettings({ ...readingSettings, fontSize: value[0] })}
                        min={14}
                        max={26}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-3">
                      <span className="text-sm font-medium">Тема</span>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'light', label: 'Светлая', icon: 'Sun' },
                          { value: 'dark', label: 'Тёмная', icon: 'Moon' },
                        ].map((theme) => (
                          <Button
                            key={theme.value}
                            variant={readingSettings.theme === theme.value ? 'default' : 'outline'}
                            className="justify-start gap-2 active:scale-95 transition-transform"
                            onClick={() => {
                              setReadingSettings({ ...readingSettings, theme: theme.value });
                              setIsDarkMode(theme.value === 'dark');
                            }}
                          >
                            <Icon name={theme.icon as any} size={16} />
                            {theme.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="px-4 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">{selectedBook.title}</h1>
            <p className="text-muted-foreground">{selectedBook.author}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Глава 12</span>
              <span>•</span>
              <span>{selectedBook.currentPage} / {selectedBook.pages}</span>
              <span>•</span>
              <span>~15 мин</span>
            </div>
          </div>

          <Card className="p-6 ios-card border-0">
            <ScrollArea className="h-[400px]">
              <div 
                className="space-y-4 leading-relaxed text-foreground" 
                style={{ fontSize: `${readingSettings.fontSize}px` }}
              >
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

          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-full active:scale-95 transition-transform"
                >
                  <Icon name="StickyNote" size={16} className="mr-2" />
                  Добавить заметку
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl">
                <DialogHeader>
                  <DialogTitle>Новая заметка</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Ваша заметка</label>
                    <Textarea
                      placeholder="Напишите заметку к этому фрагменту..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[120px] resize-none"
                    />
                  </div>
                  <Button 
                    onClick={addNote} 
                    className="w-full rounded-full active:scale-95 transition-transform"
                  >
                    Сохранить заметку
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              className="flex-1 rounded-full active:scale-95 transition-transform"
              onClick={addBookmark}
            >
              <Icon name="Bookmark" size={16} className="mr-2" />
              Закладка
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1 rounded-full active:scale-95 transition-transform">
              <Icon name="ChevronLeft" size={16} className="mr-2" />
              Назад
            </Button>
            <Button className="flex-1 rounded-full active:scale-95 transition-transform">
              Вперёд
              <Icon name="ChevronRight" size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCatalog = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="px-1">
        <h2 className="text-3xl font-bold mb-4 text-foreground">Каталог</h2>
        
        <div className="relative mb-4">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск книг и авторов"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full border-0 bg-muted"
          />
        </div>

        <ScrollArea className="w-full pb-2">
          <div className="flex gap-2">
            {['Все', 'Фантастика', 'Детектив', 'Саморазвитие', 'Классика', 'Бизнес'].map((category) => (
              <Badge
                key={category}
                variant={category === 'Все' ? 'default' : 'outline'}
                className="cursor-pointer rounded-full whitespace-nowrap active:scale-95 transition-transform"
              >
                {category}
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {mockBooks.map((book, index) => (
          <Card
            key={book.id}
            className="p-3 ios-card border-0 active:scale-95 transition-transform cursor-pointer animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <img
              src={book.cover}
              alt={book.title}
              className="w-full aspect-[2/3] object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-sm line-clamp-2 mb-1 text-foreground">{book.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{book.author}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Icon name="Star" size={12} className="fill-primary text-primary" />
                <span className="text-xs font-medium">{book.rating}</span>
              </div>
              <Badge variant="secondary" className="text-xs rounded-full">{book.category}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1 mb-6">
        <h2 className="text-3xl font-bold text-foreground">Профиль</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="rounded-full active:scale-95 transition-transform"
        >
          <Icon name={isDarkMode ? 'Sun' : 'Moon'} size={20} />
        </Button>
      </div>

      <Card className="p-5 ios-card border-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" />
            <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">АП</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-foreground">Анна Петрова</h3>
            <p className="text-sm text-muted-foreground">Активный читатель</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center ios-card border-0">
          <div className="text-3xl font-bold text-primary mb-1">{booksCompleted}</div>
          <div className="text-xs text-muted-foreground">Книг</div>
        </Card>
        <Card className="p-4 text-center ios-card border-0">
          <div className="text-3xl font-bold text-primary mb-1">{totalPagesRead}</div>
          <div className="text-xs text-muted-foreground">Страниц</div>
        </Card>
        <Card className="p-4 text-center ios-card border-0">
          <div className="text-3xl font-bold text-primary mb-1">{currentStreak}</div>
          <div className="text-xs text-muted-foreground">Дней</div>
        </Card>
      </div>

      <Card className="p-5 ios-card border-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Цель на месяц</h3>
          <span className="text-sm font-medium text-primary">60%</span>
        </div>
        <Progress value={60} className="h-2 mb-2" />
        <p className="text-xs text-muted-foreground">3 из 5 книг прочитано</p>
      </Card>

      <Card className="p-5 ios-card border-0">
        <h3 className="font-semibold mb-4 text-foreground">Активность</h3>
        <div className="grid grid-cols-7 gap-2">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, i) => (
            <div key={day} className="text-center">
              <div className="text-xs text-muted-foreground mb-2">{day}</div>
              <div
                className={`h-12 rounded-lg ${
                  i < 5 ? 'bg-primary' : 'bg-muted'
                } transition-all active:scale-95`}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-5 ios-card border-0">
        <h3 className="font-semibold mb-4 text-foreground">Любимые жанры</h3>
        <div className="space-y-3">
          {[
            { genre: 'Фантастика', count: 12, percentage: 40 },
            { genre: 'Саморазвитие', count: 8, percentage: 27 },
            { genre: 'Драма', count: 7, percentage: 23 },
            { genre: 'Детектив', count: 3, percentage: 10 },
          ].map((item) => (
            <div key={item.genre} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{item.genre}</span>
                <span className="text-muted-foreground">{item.count}</span>
              </div>
              <Progress value={item.percentage} className="h-1.5" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto bg-card min-h-screen">
        <div className="sticky top-0 ios-blur bg-card/95 border-b border-border z-20 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Cozy Reader</h1>
              <p className="text-xs text-muted-foreground">Чтение с удовольствием</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full active:scale-95 transition-transform"
            >
              <Icon name="Bell" size={20} />
            </Button>
          </div>
        </div>

        <div className="p-4 pb-24">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
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

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto ios-blur bg-card/95 border-t border-border z-20">
          <TabsList className="w-full grid grid-cols-4 h-16 bg-transparent rounded-none border-0">
            <TabsTrigger 
              value="library" 
              className="flex flex-col gap-1 data-[state=active]:bg-transparent data-[state=active]:text-primary h-full rounded-none"
            >
              <Icon name="Library" size={20} />
              <span className="text-xs">Библиотека</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reader" 
              className="flex flex-col gap-1 data-[state=active]:bg-transparent data-[state=active]:text-primary h-full rounded-none"
            >
              <Icon name="BookOpen" size={20} />
              <span className="text-xs">Чтение</span>
            </TabsTrigger>
            <TabsTrigger 
              value="catalog" 
              className="flex flex-col gap-1 data-[state=active]:bg-transparent data-[state=active]:text-primary h-full rounded-none"
            >
              <Icon name="Search" size={20} />
              <span className="text-xs">Каталог</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex flex-col gap-1 data-[state=active]:bg-transparent data-[state=active]:text-primary h-full rounded-none"
            >
              <Icon name="User" size={20} />
              <span className="text-xs">Профиль</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>
    </div>
  );
};

export default Index;
