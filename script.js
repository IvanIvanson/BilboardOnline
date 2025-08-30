        // Функция для переключения между страницами
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
            
            // Если переходим на страницу заказа, обновляем слоты
            if (pageId === 'order') {
                updateTimeSlots();
                updatePreview();
            }
        }
        
        // Генерация доступных временных слотов
        function updateTimeSlots() {
            const timeSlotsContainer = document.getElementById('time-slots');
            timeSlotsContainer.innerHTML = '';
            
            const hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', 
                          '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
            
            hours.forEach(hour => {
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.textContent = `${hour}:00`;
                
                // Помечаем ночные часы как специальное предложение
                if (parseInt(hour) >= 0 && parseInt(hour) < 7) {
                    slot.innerHTML = `${hour}:00 <br> <small>50 руб/мин</small>`;
                    slot.style.border = '2px solid var(--success)';
                }
                
                // Помечаем вечерний прайм-тайм как более дорогой
                if (parseInt(hour) >= 18 && parseInt(hour) < 23) {
                    slot.innerHTML = `${hour}:00 <br> <small>300 руб/мин</small>`;
                    slot.style.border = '2px solid var(--accent)';
                }
                
                // Случайным образом помечаем некоторые слоты как занятые
                if (Math.random() > 0.7) {
                    slot.classList.add('disabled');
                    slot.innerHTML = `${hour}:00 <br> <small>Занято</small>`;
                } else {
                    slot.addEventListener('click', function() {
                        document.querySelectorAll('.time-slot').forEach(s => {
                            s.classList.remove('selected');
                        });
                        this.classList.add('selected');
                        calculatePrice();
                    });
                }
                
                timeSlotsContainer.appendChild(slot);
            });
        }
        
        // Расчет стоимости
        function calculatePrice() {
            const selectedSlot = document.querySelector('.time-slot.selected');
            const duration = parseInt(document.getElementById('duration').value);
            
            if (!selectedSlot) return;
            
            let pricePerMinute = 100; // базовая цена по умолчанию
            
            // Извлекаем время из выбранного слота
            const timeText = selectedSlot.textContent;
            const hour = parseInt(timeText.split(':')[0]);
            
            // Определяем стоимость в зависимости от времени суток
            if (hour >= 0 && hour < 7) {
                pricePerMinute = 50; // ночное время
            } else if (hour >= 7 && hour < 10) {
                pricePerMinute = 100; // утро
            } else if (hour >= 10 && hour < 18) {
                pricePerMinute = 200; // день
            } else {
                pricePerMinute = 300; // вечер
            }
            
            const totalPrice = pricePerMinute * duration;
            document.getElementById('price-calc').textContent = totalPrice;
        }
        
        // Обновление предпросмотра
        function updatePreview() {
            const message = document.getElementById('message').value || 'Ваш текст появится здесь';
            const previewText = document.getElementById('preview-text');
            const upload = document.getElementById('upload');
            const previewImage = document.getElementById('preview-image');
            
            previewText.textContent = message;
            
            // Обработка загруженного изображения
            if (upload.files && upload.files[0]) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewImage.style.display = 'block';
                    previewText.style.display = 'none';
                }
                
                reader.readAsDataURL(upload.files[0]);
            } else {
                previewImage.style.display = 'none';
                previewText.style.display = 'block';
            }
        }
        
        // Изменение стиля текста
        function changeTextStyle(style) {
            const previewText = document.getElementById('preview-text');
            const textControls = document.querySelectorAll('.text-control');
            
            // Сброс всех стилей
            previewText.style.fontSize = '';
            previewText.style.fontWeight = '';
            previewText.style.backgroundImage = '';
            previewText.style.color = '#fff';
            
            // Установка активного класса на кнопку
            textControls.forEach(control => {
                control.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Применение выбранного стиля
            switch(style) {
                case 'large':
                    previewText.style.fontSize = '32px';
                    break;
                case 'bold':
                    previewText.style.fontWeight = 'bold';
                    break;
                case 'colorful':
                    previewText.style.backgroundImage = 'linear-gradient(45deg, #ff4e50, #f9d423)';
                    previewText.style.backgroundClip = 'text';
                    previewText.style.webkitBackgroundClip = 'text';
                    previewText.style.webkitTextFillColor = 'transparent';
                    break;
                default:
                    // Обычный стиль
                    break;
            }
        }
        
        // Тест анимации
        function testAnimation() {
            const previewContent = document.querySelector('.preview-content');
            previewContent.style.animation = 'none';
            
            setTimeout(() => {
                previewContent.style.animation = 'pulse 2s infinite';
                
                // Остановка анимации через 5 секунд
                setTimeout(() => {
                    previewContent.style.animation = 'none';
                }, 5000);
            }, 10);
        }
        
        // Добавляем CSS анимацию
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .preview-content {
                transition: all 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        
        // Обработчики событий
        document.getElementById('duration').addEventListener('change', calculatePrice);
        document.getElementById('message').addEventListener('input', updatePreview);
        document.getElementById('upload').addEventListener('change', updatePreview);
        
        document.getElementById('registration-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Регистрация успешно завершена!');
            showPage('order');
        });
        
        document.getElementById('order-form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Заказ успешно создан! Переходим к оплате...');
            // Здесь была бы реализация перехода к оплате
        });
        
        // Инициализация при загрузке
        document.addEventListener('DOMContentLoaded', function() {
            // Устанавливаем минимальную дату как сегодняшний день
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('order-date').setAttribute('min', today);
            document.getElementById('order-date').value = today;
            
            // Инициализация предпросмотра
            updatePreview();        });
    