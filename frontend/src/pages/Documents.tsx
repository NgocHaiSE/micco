import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  Image, 
  File, 
  Trash2, 
  Download, 
  Eye,
  Calendar,
  Tag,
  FolderOpen,
  Grid,
  List,
  Plus,
  MoreVertical,
  RefreshCw,
  FolderPlus,
  CheckSquare,
  Square,
  Ellipsis
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data based on the document structure you provided
const mockDocuments = [
  {
    id: 1,
    name: 'Báo cáo sản xuất tháng 11.pdf',
    type: 'Báo cáo sản xuất hàng ngày/tháng',
    category: 'Dữ liệu vận hành và sản xuất',
    size: '2.4 MB',
    uploadDate: '2024-11-15',
    tags: ['sản xuất', 'báo cáo', 'kpi'],
    fileType: 'pdf',
    description: 'Báo cáo sản lượng khai thác và năng suất theo tổ/ca/khu vực tháng 11'
  },
  {
    id: 2,
    name: 'Bản đồ địa chất mỏ A.dwg',
    type: 'Bản đồ địa chất',
    category: 'Dữ liệu kỹ thuật -- khai thác và sản xuất',
    size: '15.7 MB',
    uploadDate: '2024-11-10',
    tags: ['địa chất', 'bản đồ', '2d/3d'],
    fileType: 'dwg',
    description: 'Dữ liệu khảo sát mỏ (bản đồ 2D/3D, mặt cắt, mô hình khối)'
  },
  {
    id: 3,
    name: 'Báo cáo tai nạn lao động Q3.docx',
    type: 'Báo cáo sự cố',
    category: 'Dữ liệu an toàn - môi trường',
    size: '1.8 MB',
    uploadDate: '2024-10-05',
    tags: ['an toàn', 'tai nạn', 'báo cáo'],
    fileType: 'docx',
    description: 'Báo cáo các tai nạn lao động, nguyên nhân và biện pháp khắc phục'
  },
  {
    id: 4,
    name: 'Quy trình khai thác 2024.pdf',
    type: 'Quy trình khai thác',
    category: 'Dữ liệu kỹ thuật -- khai thác và sản xuất',
    size: '5.2 MB',
    uploadDate: '2024-09-20',
    tags: ['quy trình', 'khai thác', 'công nghệ'],
    fileType: 'pdf',
    description: 'Các bước, công nghệ khai thác, thời gian thực hiện'
  },
  {
    id: 5,
    name: 'Danh sách nhân sự.xlsx',
    type: 'Thông tin nhân sự',
    category: 'Dữ liệu tổ chức -- nhân sự',
    size: '0.9 MB',
    uploadDate: '2024-11-01',
    tags: ['nhân sự', 'kỹ năng', 'chức vụ'],
    fileType: 'xlsx',
    description: 'Thông tin kỹ năng, chức vụ, lịch sử công tác, chứng chỉ chuyên môn'
  },
  {
    id: 6,
    name: 'Hướng dẫn vận hành máy khoan.pdf',
    type: 'Tài liệu hướng dẫn',
    category: 'Dữ liệu quản trị tri thức',
    size: '3.1 MB',
    uploadDate: '2024-10-15',
    tags: ['hướng dẫn', 'vận hành', 'đào tạo'],
    fileType: 'pdf',
    description: 'Hướng dẫn vận hành, đào tạo, bảo trì thiết bị'
  },
  {
    id: 7,
    name: 'Giấy phép khai thác 2024.pdf',
    type: 'Giấy phép khai thác',
    category: 'Dữ liệu pháp lý và tiêu chuẩn',
    size: '1.2 MB',
    uploadDate: '2024-01-15',
    tags: ['giấy phép', 'pháp lý', 'khai thác'],
    fileType: 'pdf',
    description: 'Giấy phép với thời hạn, vị trí, khối lượng được phép khai thác'
  },
  {
    id: 8,
    name: 'Dữ liệu quan trắc môi trường.csv',
    type: 'Dữ liệu quan trắc môi trường',
    category: 'Dữ liệu an toàn - môi trường',
    size: '2.7 MB',
    uploadDate: '2024-11-12',
    tags: ['môi trường', 'quan trắc', 'không khí', 'nước'],
    fileType: 'csv',
    description: 'Dữ liệu quan trắc không khí, nước, tiếng ồn, chất thải'
  }
];

const categories = [
  'Tất cả',
  'Dữ liệu kỹ thuật -- khai thác và sản xuất',
  'Dữ liệu vận hành và sản xuất', 
  'Dữ liệu an toàn - môi trường',
  'Dữ liệu tổ chức -- nhân sự',
  'Dữ liệu quản trị tri thức',
  'Dữ liệu pháp lý và tiêu chuẩn'
];

const getFileIcon = (fileType) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return <FileText className="h-8 w-8 text-red-500" />;
    case 'dwg':
      return <Image className="h-8 w-8 text-blue-500" />;
    case 'docx':
      return <FileText className="h-8 w-8 text-blue-600" />;
    case 'xlsx':
      return <FileText className="h-8 w-8 text-green-600" />;
    case 'csv':
      return <FileText className="h-8 w-8 text-orange-500" />;
    default:
      return <File className="h-8 w-8 text-gray-500" />;
  }
};

const getCategoryColor = (category) => {
  const colors = {
    'Dữ liệu kỹ thuật -- khai thác và sản xuất': 'bg-blue-100 text-blue-800',
    'Dữ liệu vận hành và sản xuất': 'bg-green-100 text-green-800',
    'Dữ liệu an toàn - môi trường': 'bg-red-100 text-red-800',
    'Dữ liệu tổ chức -- nhân sự': 'bg-purple-100 text-purple-800',
    'Dữ liệu quản trị tri thức': 'bg-yellow-100 text-yellow-800',
    'Dữ liệu pháp lý và tiêu chuẩn': 'bg-gray-100 text-gray-800'
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fileInputRef = useRef(null);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Tất cả' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    // In a real application, you would upload these files to your server
    console.log('Files to upload:', files);
  };

  const handleDelete = (docId) => {
    setDocuments(docs => docs.filter(doc => doc.id !== docId));
  };

  const handleDownload = (doc) => {
    // In a real application, this would trigger a file download
    console.log('Downloading:', doc.name);
  };

  const handleView = (doc) => {
    // In a real application, this would open the document viewer
    console.log('Viewing:', doc.name);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleCreateFolder = () => {
    console.log('Creating new folder...');
  };

  const handleSelectDocument = (docId) => {
    const newSelected = new Set(selectedDocuments);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocuments(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocuments.size === filteredDocuments.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(filteredDocuments.map(doc => doc.id)));
    }
  };

  const handleBulkDelete = () => {
    setDocuments(docs => docs.filter(doc => !selectedDocuments.has(doc.id)));
    setSelectedDocuments(new Set());
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Tài liệu</h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý và tổ chức tài liệu khai thác mỏ
            </p>
          </div>
        </div>

        {/* Enhanced Toolbar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Search and Filters */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 'bg-blue-50' : ''}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateFolder}
              className="h-9"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            {selectedDocuments.size > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    Bulk Actions
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      {selectedDocuments.size}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleBulkDelete} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Selected ({selectedDocuments.size})
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Tag className="h-4 w-4 mr-2" />
                    Add Tags
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-2">
                  <Ellipsis className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                  {viewMode === 'grid' ? (
                    <>
                      <List className="h-4 w-4 mr-2" />
                      List View
                    </>
                  ) : (
                    <>
                      <Grid className="h-4 w-4 mr-2" />
                      Grid View
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSelectAll}>
                  {selectedDocuments.size === filteredDocuments.length ? (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Select All
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" onClick={() => fileInputRef.current?.click()} className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.dwg,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-white border-b">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
            <div className="text-sm text-gray-600">Tổng số tài liệu</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.category === 'Dữ liệu vận hành và sản xuất').length}
            </div>
            <div className="text-sm text-gray-600">Vận hành & Sản xuất</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {documents.filter(d => d.category === 'Dữ liệu an toàn - môi trường').length}
            </div>
            <div className="text-sm text-gray-600">An toàn & Môi trường</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {documents.filter(d => d.category === 'Dữ liệu pháp lý và tiêu chuẩn').length}
            </div>
            <div className="text-sm text-gray-600">Pháp lý & Tiêu chuẩn</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy tài liệu</h3>
            <p className="text-gray-600">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className={`hover:shadow-md transition-shadow ${selectedDocuments.has(doc.id) ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="cursor-pointer"
                        onClick={() => handleSelectDocument(doc.id)}
                      >
                        {selectedDocuments.has(doc.id) ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                        )}
                      </div>
                      {getFileIcon(doc.fileType)}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-medium truncate">
                          {doc.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500">
                          {doc.size} • {doc.uploadDate}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(doc)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload(doc)}>
                          <Download className="h-4 w-4 mr-2" />
                          Tải xuống
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs mb-2 ${getCategoryColor(doc.category)}`}
                  >
                    {doc.type}
                  </Badge>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {doc.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{doc.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border">
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm text-gray-700">
              <div className="col-span-4 flex items-center gap-2">
                <div onClick={handleSelectAll} className="cursor-pointer">
                  {selectedDocuments.size === filteredDocuments.length ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </div>
                Tên tài liệu
              </div>
              <div className="col-span-2">Loại</div>
              <div className="col-span-2">Danh mục</div>
              <div className="col-span-1">Kích thước</div>
              <div className="col-span-2">Ngày tải lên</div>
              <div className="col-span-1">Thao tác</div>
            </div>
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className={`grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center ${selectedDocuments.has(doc.id) ? 'bg-blue-50' : ''}`}>
                <div className="col-span-4 flex items-center gap-3">
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleSelectDocument(doc.id)}
                  >
                    {selectedDocuments.has(doc.id) ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </div>
                  {getFileIcon(doc.fileType)}
                  <div>
                    <div className="font-medium text-sm">{doc.name}</div>
                    <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
                      {doc.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge variant="secondary" className={`text-xs ${getCategoryColor(doc.category)}`}>
                    {doc.type}
                  </Badge>
                </div>
                <div className="col-span-2 text-sm text-gray-600">
                  {doc.category.length > 30 ? `${doc.category.substring(0, 30)}...` : doc.category}
                </div>
                <div className="col-span-1 text-sm text-gray-600">{doc.size}</div>
                <div className="col-span-2 text-sm text-gray-600">{doc.uploadDate}</div>
                <div className="col-span-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(doc)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(doc)}>
                        <Download className="h-4 w-4 mr-2" />
                        Tải xuống
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}