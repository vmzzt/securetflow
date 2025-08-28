# ================================
# GODOFREDA CLEANUP SERVICE
# ================================
# Serviço de limpeza automática otimizado com APScheduler
# ================================

import asyncio
import logging
import os
import time
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any
# from apscheduler.asyncio import AsyncIOScheduler
# from apscheduler.triggers.interval import IntervalTrigger
from config import config

logger = logging.getLogger(__name__)

class OptimizedCleanupService:
    """Serviço de limpeza otimizado com agendamento eficiente"""
    
    def __init__(self):
        # self.scheduler = AsyncIOScheduler()
        self.is_running = False
        self.cleanup_tasks: List[asyncio.Task] = []
        self.stats = {
            "files_cleaned": 0,
            "space_freed": 0,
            "last_cleanup": None,
            "errors": 0
        }
        
    async def start(self) -> None:
        """Inicia o serviço de limpeza"""
        try:
            logger.info("Iniciando serviço de limpeza simplificado...")
            self.is_running = True
            
            # Configurar jobs agendados (desabilitado por enquanto)
            # self._setup_scheduled_jobs()
            
            # Iniciar scheduler (desabilitado por enquanto)
            # self.scheduler.start()
            
            logger.info("Serviço de limpeza iniciado com sucesso")
            
        except Exception as e:
            logger.error(f"Erro ao iniciar serviço de limpeza: {e}")
            self.stats["errors"] += 1
    
    def _setup_scheduled_jobs(self) -> None:
        """Configura jobs agendados para diferentes tipos de limpeza"""
        
        # Desabilitado por enquanto devido a problemas com APScheduler
        logger.info("Jobs de limpeza agendados desabilitados temporariamente")
        
        # # Limpeza de arquivos TTS temporários (a cada 30 minutos)
        # self.scheduler.add_job(
        #     self._cleanup_tts_temp,
        #     IntervalTrigger(minutes=30),
        #     id='tts_temp_cleanup',
        #     name='TTS Temp Files Cleanup',
        #     replace_existing=True
        # )
        
        # # Limpeza de logs antigos (a cada 2 horas)
        # self.scheduler.add_job(
        #     self._cleanup_logs,
        #     IntervalTrigger(hours=2),
        #     id='logs_cleanup',
        #     name='Logs Cleanup',
        #     replace_existing=True
        # )
        
        # # Limpeza de cache (a cada 6 horas)
        # self.scheduler.add_job(
        #     self._cleanup_cache,
        #     IntervalTrigger(hours=6),
        #     id='cache_cleanup',
        #     name='Cache Cleanup',
        #     replace_existing=True
        # )
        
        # # Limpeza geral (diária)
        # self.scheduler.add_job(
        #     self._cleanup_general,
        #     IntervalTrigger(hours=24),
        #     id='general_cleanup',
        #     name='General Cleanup',
        #     replace_existing=True
        # )
        
        # logger.info("Jobs de limpeza agendados configurados")
    
    async def _cleanup_tts_temp(self) -> None:
        """Limpa arquivos temporários do TTS"""
        try:
            temp_dir = Path(config.tts.temp_dir)
            if not temp_dir.exists():
                logger.debug("Diretório TTS temp não existe")
                return
            
            max_age = timedelta(hours=config.file.file_max_age_hours)
            current_time = datetime.now()
            files_cleaned = 0
            space_freed = 0
            
            for file_path in temp_dir.rglob("*"):
                if file_path.is_file():
                    file_age = current_time - datetime.fromtimestamp(file_path.stat().st_mtime)
                    
                    if file_age > max_age:
                        try:
                            file_size = file_path.stat().st_size
                            file_path.unlink()
                            files_cleaned += 1
                            space_freed += file_size
                            logger.debug(f"Arquivo TTS removido: {file_path}")
                        except Exception as e:
                            logger.warning(f"Erro ao remover arquivo {file_path}: {e}")
            
            if files_cleaned > 0:
                self.stats["files_cleaned"] += files_cleaned
                self.stats["space_freed"] += space_freed
                self.stats["last_cleanup"] = current_time.isoformat()
                
                logger.info(f"Limpeza TTS: {files_cleaned} arquivos removidos, "
                           f"{space_freed / 1024 / 1024:.2f} MB liberados")
            
        except Exception as e:
            logger.error(f"Erro na limpeza TTS: {e}")
            self.stats["errors"] += 1
    
    async def _cleanup_logs(self) -> None:
        """Limpa logs antigos"""
        try:
            log_dir = Path("app/logs")
            if not log_dir.exists():
                return
            
            max_age = timedelta(days=7)  # Manter logs por 7 dias
            current_time = datetime.now()
            files_cleaned = 0
            space_freed = 0
            
            for log_file in log_dir.glob("*.log*"):
                if log_file.is_file():
                    file_age = current_time - datetime.fromtimestamp(log_file.stat().st_mtime)
                    
                    if file_age > max_age:
                        try:
                            file_size = log_file.stat().st_size
                            log_file.unlink()
                            files_cleaned += 1
                            space_freed += file_size
                        except Exception as e:
                            logger.warning(f"Erro ao remover log {log_file}: {e}")
            
            if files_cleaned > 0:
                self.stats["files_cleaned"] += files_cleaned
                self.stats["space_freed"] += space_freed
                logger.info(f"Limpeza logs: {files_cleaned} arquivos removidos, "
                           f"{space_freed / 1024 / 1024:.2f} MB liberados")
            
        except Exception as e:
            logger.error(f"Erro na limpeza de logs: {e}")
            self.stats["errors"] += 1
    
    async def _cleanup_cache(self) -> None:
        """Limpa cache antigo"""
        try:
            cache_dirs = [
                Path("/tmp/numba_cache"),
                Path("/tmp/matplotlib-*"),
                Path("/tmp/tts_cache")
            ]
            
            files_cleaned = 0
            space_freed = 0
            
            for cache_pattern in cache_dirs:
                if cache_pattern.exists():
                    for cache_file in cache_pattern.rglob("*"):
                        if cache_file.is_file():
                            try:
                                file_size = cache_file.stat().st_size
                                cache_file.unlink()
                                files_cleaned += 1
                                space_freed += file_size
                            except Exception as e:
                                logger.debug(f"Erro ao remover cache {cache_file}: {e}")
            
            if files_cleaned > 0:
                self.stats["files_cleaned"] += files_cleaned
                self.stats["space_freed"] += space_freed
                logger.info(f"Limpeza cache: {files_cleaned} arquivos removidos, "
                           f"{space_freed / 1024 / 1024:.2f} MB liberados")
            
        except Exception as e:
            logger.error(f"Erro na limpeza de cache: {e}")
            self.stats["errors"] += 1
    
    async def _cleanup_general(self) -> None:
        """Limpeza geral do sistema"""
        try:
            # Limpar diretórios temporários do sistema
            temp_dirs = ["/tmp", "/var/tmp"]
            files_cleaned = 0
            space_freed = 0
            
            for temp_dir in temp_dirs:
                temp_path = Path(temp_dir)
                if temp_path.exists():
                    for temp_file in temp_path.glob("godofreda_*"):
                        if temp_file.is_file():
                            try:
                                file_age = datetime.now() - datetime.fromtimestamp(temp_file.stat().st_mtime)
                                if file_age > timedelta(hours=24):
                                    file_size = temp_file.stat().st_size
                                    temp_file.unlink()
                                    files_cleaned += 1
                                    space_freed += file_size
                            except Exception as e:
                                logger.debug(f"Erro ao remover arquivo temporário {temp_file}: {e}")
            
            if files_cleaned > 0:
                self.stats["files_cleaned"] += files_cleaned
                self.stats["space_freed"] += space_freed
                logger.info(f"Limpeza geral: {files_cleaned} arquivos removidos, "
                           f"{space_freed / 1024 / 1024:.2f} MB liberados")
            
        except Exception as e:
            logger.error(f"Erro na limpeza geral: {e}")
            self.stats["errors"] += 1
    
    async def force_cleanup(self, category: str = "all") -> Dict[str, Any]:
        """Força limpeza imediata"""
        try:
            logger.info(f"Forçando limpeza: {category}")
            
            if category == "tts" or category == "all":
                await self._cleanup_tts_temp()
            
            if category == "logs" or category == "all":
                await self._cleanup_logs()
            
            if category == "cache" or category == "all":
                await self._cleanup_cache()
            
            if category == "general" or category == "all":
                await self._cleanup_general()
            
            return {
                "success": True,
                "message": f"Limpeza forçada concluída: {category}",
                "stats": self.stats.copy()
            }
            
        except Exception as e:
            logger.error(f"Erro na limpeza forçada: {e}")
            return {
                "success": False,
                "error": str(e),
                "stats": self.stats.copy()
            }
    
    def get_stats(self) -> Dict[str, Any]:
        """Retorna estatísticas do serviço de limpeza"""
        return {
            "is_running": self.is_running,
            "jobs_count": len(self.scheduler.get_jobs()),
            "stats": self.stats.copy(),
            "next_run": {
                job.id: job.next_run_time.isoformat() if job.next_run_time else None
                for job in self.scheduler.get_jobs()
            }
        }
    
    async def stop(self) -> None:
        """Para o serviço de limpeza"""
        try:
            logger.info("Parando serviço de limpeza...")
            self.is_running = False
            
            if self.scheduler.running:
                self.scheduler.shutdown(wait=True)
            
            # Cancelar tasks pendentes
            for task in self.cleanup_tasks:
                if not task.done():
                    task.cancel()
            
            logger.info("Serviço de limpeza parado")
            
        except Exception as e:
            logger.error(f"Erro ao parar serviço de limpeza: {e}")

# Instância global do serviço de limpeza
cleanup_service = OptimizedCleanupService()

# Função para iniciar limpeza em background
async def start_background_cleanup():
    """Inicia o serviço de limpeza em background"""
    await cleanup_service.start()

# Função para limpeza manual
async def manual_cleanup() -> Dict[str, int]:
    """Executa limpeza manual"""
    return await cleanup_service.force_cleanup() 