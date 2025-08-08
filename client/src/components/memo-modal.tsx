import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Memo {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function MemoModal({ isOpen, onClose }: MemoModalProps) {
  const [editingMemo, setEditingMemo] = useState<Memo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userId] = useState(`user_${Math.random().toString(36).substring(7)}`);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: memos = [], isLoading } = useQuery({
    queryKey: ['/api/memos', userId],
    enabled: isOpen,
  }) as { data: Memo[], isLoading: boolean };

  const createMemoMutation = useMutation({
    mutationFn: async (memo: { title: string; content: string; userId: string }) => {
      const response = await apiRequest('POST', '/api/memos', memo);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memos', userId] });
      resetForm();
      toast({
        title: "メモを作成しました",
        description: "新しいメモが保存されました。",
      });
    },
  });

  const updateMemoMutation = useMutation({
    mutationFn: async ({ id, memo }: { id: string; memo: { title: string; content: string } }) => {
      const response = await apiRequest('PUT', `/api/memos/${id}`, memo);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memos', userId] });
      resetForm();
      toast({
        title: "メモを更新しました",
        description: "メモの変更が保存されました。",
      });
    },
  });

  const deleteMemoMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/memos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/memos', userId] });
      toast({
        title: "メモを削除しました",
        description: "メモが正常に削除されました。",
      });
    },
  });

  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingMemo(null);
    setIsCreating(false);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "エラー",
        description: "タイトルと内容を入力してください。",
        variant: "destructive",
      });
      return;
    }

    if (editingMemo) {
      updateMemoMutation.mutate({
        id: editingMemo.id,
        memo: { title: title.trim(), content: content.trim() }
      });
    } else {
      createMemoMutation.mutate({
        title: title.trim(),
        content: content.trim(),
        userId
      });
    }
  };

  const handleEdit = (memo: Memo) => {
    setEditingMemo(memo);
    setTitle(memo.title);
    setContent(memo.content);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('このメモを削除しますか？')) {
      deleteMemoMutation.mutate(id);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-white border-opacity-20 max-w-2xl max-h-[80vh] overflow-hidden" data-testid="memo-modal">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold flex justify-between items-center">
            メモ帳
            <button 
              onClick={onClose}
              className="text-white opacity-70 hover:opacity-100"
              data-testid="close-memo"
            >
              <X className="w-6 h-6" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-full max-h-[60vh]">
          {!isCreating ? (
            <>
              {/* Memo List View */}
              <div className="flex justify-between items-center mb-4">
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-river-blue hover:bg-river-light text-white"
                  data-testid="create-memo-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  新規メモ
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3" data-testid="memo-list">
                {isLoading ? (
                  <div className="text-white text-center py-8">読み込み中...</div>
                ) : memos.length === 0 ? (
                  <div className="text-white text-center py-8 opacity-70">
                    メモがありません。新規メモを作成してください。
                  </div>
                ) : (
                  memos.map((memo) => (
                    <div 
                      key={memo.id} 
                      className="glassmorphism-light rounded-lg p-4 hover:bg-opacity-20 transition-all"
                      data-testid={`memo-item-${memo.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium text-lg" data-testid={`memo-title-${memo.id}`}>
                          {memo.title}
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(memo)}
                            className="text-white opacity-70 hover:opacity-100"
                            data-testid={`edit-memo-${memo.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(memo.id)}
                            className="text-red-400 opacity-70 hover:opacity-100"
                            data-testid={`delete-memo-${memo.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-white opacity-80 text-sm mb-2 line-clamp-3" data-testid={`memo-content-${memo.id}`}>
                        {memo.content}
                      </p>
                      <p className="text-white opacity-50 text-xs" data-testid={`memo-date-${memo.id}`}>
                        {formatDate(memo.updatedAt)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              {/* Create/Edit Form */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-lg font-medium">
                  {editingMemo ? 'メモを編集' : '新規メモ'}
                </h3>
                <Button
                  onClick={resetForm}
                  variant="ghost"
                  className="text-white opacity-70 hover:opacity-100"
                  data-testid="cancel-memo-button"
                >
                  キャンセル
                </Button>
              </div>

              <div className="space-y-4 flex-1 flex flex-col">
                <Input
                  placeholder="メモのタイトル"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="glassmorphism-light border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60"
                  data-testid="memo-title-input"
                />
                
                <Textarea
                  placeholder="メモの内容を入力してください..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="glassmorphism-light border-white border-opacity-20 text-white placeholder-white placeholder-opacity-60 flex-1 min-h-[200px] resize-none"
                  data-testid="memo-content-input"
                />

                <Button
                  onClick={handleSave}
                  disabled={!title.trim() || !content.trim() || createMemoMutation.isPending || updateMemoMutation.isPending}
                  className="bg-river-blue hover:bg-river-light text-white self-end"
                  data-testid="save-memo-button"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingMemo ? '更新' : '保存'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
