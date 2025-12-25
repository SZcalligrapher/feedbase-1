import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@ui/components/ui/button';
import { Input } from '@ui/components/ui/input';
import { Label } from '@ui/components/ui/label';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@ui/components/ui/responsive-dialog';
import { toast } from 'sonner';
import { Icons } from '@/components/shared/icons/icons-static';
import PostEditor from '@/components/shared/tiptap-editor';

export default function CreatePostModal({
  projectSlug,
  children,
  isLoggedIn,
}: {
  projectSlug: string;
  children: React.ReactNode;
  isLoggedIn?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>(''); // 留名输入框
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Submit post
  function onSubmit() {
    // 如果未登录，检查留名是否填写
    if (!isLoggedIn && !authorName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    // Set loading
    setIsLoading(true);

    // Create promise
    const promise = new Promise((resolve, reject) => {
      fetch(`/api/v1/projects/${projectSlug}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: content,
          // 如果未登录，传递用户信息（留名）
          user: !isLoggedIn
            ? {
                email: `anonymous-${Date.now()}@widget.local`, // 生成一个唯一的匿名邮箱
                full_name: authorName.trim(),
              }
            : undefined,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || data.error) {
            reject(data.error || data.message || 'Failed to create post');
          } else {
            resolve(data);
          }
        })
        .catch((err) => {
          reject(err.message || 'Failed to create post');
        });
    });

    promise
      .then(() => {
        // Close modal
        setOpen(false);

        // Set loading
        setIsLoading(false);

        // Reset form
        setTitle('');
        setContent('');
        setAuthorName('');

        // Reload comments
        router.refresh();
      })
      .catch((err) => {
        toast.error(err);
        setIsLoading(false);
      });
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>{children}</ResponsiveDialogTrigger>
      <ResponsiveDialogContent className='sm:max-w-[425px]'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Create a new post</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>Have an idea or found a bug? Let us know!</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className='flex flex-col gap-4'>
          {/* Author Name (only show if not logged in) */}
          {!isLoggedIn && (
            <div className='flex flex-col gap-2'>
              <div className='flex flex-row items-center gap-2'>
                <Label htmlFor='author-name'>Your Name</Label>
                <span className='text-destructive text-xs'>*</span>
              </div>

              <Input
                id='author-name'
                placeholder='Enter your name'
                value={authorName}
                onChange={(event) => {
                  setAuthorName(event.currentTarget.value);
                }}
                className='bg-secondary/30 font-light'
                required
              />
            </div>
          )}

          {/* Title */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='title'>Title</Label>
            </div>

            <Input
              id='title'
              placeholder='Your post title'
              value={title}
              onChange={(event) => {
                setTitle(event.currentTarget.value);
              }}
              className='bg-secondary/30 font-light'
            />
          </div>

          {/* Description */}
          <div className='flex flex-col gap-2'>
            <div className='flex flex-row items-center gap-2'>
              <Label htmlFor='content'>Description</Label>
            </div>

            <div className='bg-secondary/30 focus-within:ring-ring ring-offset-root flex w-full flex-col items-center justify-end rounded-sm border p-4 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-offset-1'>
              {/* Editable Comment div with placeholder */}
              <PostEditor content={content} setContent={setContent} className='min-h-[50px]' />
            </div>

            <Label className='text-foreground/50 text-xs font-extralight'>
              You can use Markdown to format your post.
            </Label>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <Button
            variant='default'
            type='submit'
            onClick={onSubmit}
            disabled={
              !title ||
              content.replace(/<[^>]*>?/gm, '').length === 0 ||
              (!isLoggedIn && !authorName.trim()) ||
              isLoading
            }>
            {isLoading ? <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
            Submit Post
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
