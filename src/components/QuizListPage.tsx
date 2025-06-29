import React, { useState } from 'react';
import { SavedQuizData } from '../types';
import EmptyState from './EmptyState';

interface QuizListPageProps {
  savedQuizzes: SavedQuizData[];
  onViewQuiz: (quiz: SavedQuizData) => void;
  onAddNewQuiz: () => void;
  onAddNewPersonalizedQuiz?: () => void; 
  theme?: string;
}

const QuizListPage: React.FC<QuizListPageProps> = ({ savedQuizzes, onViewQuiz, onAddNewQuiz, onAddNewPersonalizedQuiz, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuizzes = (savedQuizzes || []).filter(quiz =>
    (quiz.pdfName || `Sınav ${new Date(quiz.savedAt).toLocaleDateString()}`).toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.savedAt - a.savedAt); 

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('tr-TR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="w-full h-full flex flex-col p-0">
      <div className="mb-4 sm:mb-6 px-1">
        <h1 className={`text-2xl sm:text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Sınavlarım</h1>
        <p className={`text-sm sm:text-base ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Geçmiş sınavlarınızı görüntüleyin ve yeni sınavlar oluşturun.</p>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 px-1">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Sınav ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 pl-10 border rounded-lg focus:ring-primary-500 focus:border-primary-500 touch-target ${theme === 'dark' ? 'bg-secondary-800 border-secondary-700 text-gray-200 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'}`}
            aria-label="Sınav arama"
          />
          <i className={`fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}></i>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-none">
            <select
              className={`appearance-none w-full p-3 pr-10 border rounded-lg focus:ring-primary-500 focus:border-primary-500 touch-target ${theme === 'dark' ? 'bg-secondary-800 border-secondary-700 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`}
              aria-label="Sınav türüne göre filtrele"
              defaultValue="all"
            >
              <option value="all">Tüm Sınavlar</option>
            </select>
            <i className={`fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}></i>
          </div>
          <button
            onClick={onAddNewQuiz}
            className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center text-sm touch-target"
            title="Yeni Hızlı Sınav Oluştur"
          >
            <i className="fas fa-bolt mr-2"></i> Hızlı Sınav
          </button>
          {onAddNewPersonalizedQuiz && (
            <button
              onClick={onAddNewPersonalizedQuiz}
              className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center text-sm touch-target"
              title="Yeni Kişiselleştirilmiş Sınav Oluştur"
            >
              <i className="fas fa-user-cog mr-2"></i> 
              <span className="hidden sm:inline">Kişisel Sınav</span>
              <span className="sm:hidden">Kişisel</span>
            </button>
          )}
        </div>
      </div>

      <div className={`flex-grow overflow-y-auto rounded-lg shadow-xl ring-1 ${theme === 'dark' ? 'bg-secondary-800 ring-secondary-700/50' : 'bg-white ring-gray-200'}`}>
        {filteredQuizzes.length === 0 ? (
           <EmptyState
            iconClass="fas fa-folder-open"
            title="Henüz Kaydedilmiş Sınav Yok"
            message="Oluşturduğunuz sınavların sonuçları burada listelenir. Hemen yeni bir tane oluşturun!"
            theme={theme}
            actionButton={onAddNewPersonalizedQuiz ? {
              text: "Yeni Kişisel Sınav Oluştur",
              onClick: onAddNewPersonalizedQuiz,
              iconClass: "fas fa-user-cog",
              gradientClasses: "bg-gradient-to-r from-pink-500 to-fuchsia-600",
            } : {
              text: "Yeni Hızlı Sınav Oluştur",
              onClick: onAddNewQuiz,
              iconClass: "fas fa-bolt",
              gradientClasses: "bg-gradient-to-r from-cyan-500 to-blue-600",
            }
          }
          />
        ) : (
          <div className="block lg:hidden">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className={`p-4 border-b ${theme === 'dark' ? 'border-secondary-700' : 'border-gray-200'} last:border-b-0`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0 mr-3">
                    <h3 className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} title={quiz.pdfName || `Sınav (${formatDate(quiz.savedAt).split(' ')[0]})`}>
                      {quiz.pdfName || `Sınav (${formatDate(quiz.savedAt).split(' ')[0]})`}
                    </h3>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{quiz.totalQuestions} Soru</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full flex-shrink-0
                                   ${quiz.quizType === 'Kişiselleştirilmiş Sınav' ? 
                                     (theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700') : 
                                     (theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700')}`}>
                    {quiz.quizType === 'Kişiselleştirilmiş Sınav' ? 'Kişisel' : 'Hızlı'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formatDate(quiz.savedAt)}</p>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      {`${quiz.score}/${quiz.totalQuestions} (%${Math.round((quiz.score/quiz.totalQuestions)*100)})`}
                    </p>
                  </div>
                  <button
                    onClick={() => onViewQuiz(quiz)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors touch-target ${theme === 'dark' ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}
                    aria-label={`'${quiz.pdfName || 'Bu sınavı'}' görüntüle`}
                  >
                    Görüntüle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {filteredQuizzes.length > 0 && (
          <table className={`hidden lg:table w-full min-w-full divide-y ${theme === 'dark' ? 'divide-secondary-700' : 'divide-gray-200'}`}>
            <thead className={`sticky top-0 z-10 ${theme === 'dark' ? 'bg-secondary-700/50' : 'bg-gray-50'}`}>
              <tr>
                <th scope="col" className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Sinav</th>
                <th scope="col" className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Tür</th>
                <th scope="col" className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Tarih</th>
                <th scope="col" className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Skor</th>
                <th scope="col" className={`px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>İşlemler</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'dark' ? 'divide-secondary-700' : 'divide-gray-200'}`}>
              {filteredQuizzes.map((quiz) => (
                <tr key={quiz.id} className={`transition-colors duration-150 ${theme === 'dark' ? 'hover:bg-secondary-700/30' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`mr-3 flex-shrink-0 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`}>
                        <i className="fas fa-file-alt text-xl"></i>
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium truncate max-w-xs md:max-w-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} title={quiz.pdfName || `Sınav (${formatDate(quiz.savedAt).split(' ')[0]})`}>
                          {quiz.pdfName || `Sınav (${formatDate(quiz.savedAt).split(' ')[0]})`}
                        </div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{quiz.totalQuestions} Soru</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                     ${quiz.quizType === 'Kişiselleştirilmiş Sınav' ? 
                                       (theme === 'dark' ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700') : 
                                       (theme === 'dark' ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700')}`}>
                      {quiz.quizType || "Hızlı Sınav"}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{formatDate(quiz.savedAt)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {`${quiz.score}/${quiz.totalQuestions} (%${Math.round((quiz.score/quiz.totalQuestions)*100)})`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onViewQuiz(quiz)}
                      className={`transition-colors touch-target ${theme === 'dark' ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}
                      aria-label={`'${quiz.pdfName || 'Bu sınavı'}' görüntüle`}
                    >
                      Sonucu Görüntüle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default React.memo(QuizListPage);