import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArticuloService } from '../../../../services/articulo.service';


@Component({
  selector: 'app-articulos-nuevos',
  standalone: true,
  imports: [
      RouterModule,
      MatIconModule,
      CommonModule,
      FormsModule
    ],
  templateUrl: './articulos-nuevos.html',
  styleUrl: './articulos-nuevos.css'
})
export class ArticulosNuevosCommponent implements OnInit {

  formData = {
    codigo: '',
    proveedor: '',
    nombre: ''
  };

  proveedores: any[] = [];
  articulos: any[] = [];
  mensaje: string = '';
  page: number = 1;
  totalPages: number = 1;
  registroExitoso: boolean = false;
  editandoId: string | null = null;

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private articuloService: ArticuloService,
    private router: Router
  ) {}

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    this.cargarCodigo();
    this.cargarProveedores();
    this.cargarArticulos();
  }

  cargarCodigo() {
    this.articuloService.getSiguienteCodigo().subscribe({
      next: (res) => {
        this.formData.codigo = res.siguienteCodigo;
      },
      error: (err) => {
        console.error(err);
        this.mensaje = 'Error al generar el código.';
      }
    });
  }

  cargarProveedores() {
    this.articuloService.getProveedores().subscribe({
      next: (res: any) => this.proveedores = res.data ?? res,
      error: (err) => console.error('Error al cargar proveedores:', err)
    });
  }

  cargarArticulos() {
    this.articuloService.getArticulos(this.page, 10).subscribe({
      next: (res) => {
        this.articulos = res.data;
        this.totalPages = res.pagination.totalPages;
      },
      error: (err) => console.error('Error al cargar artículos:', err)
    });
  }

  guardarArticulo() {
    if (!this.formData.proveedor || !this.formData.nombre) return;

    if (this.editandoId) {
      // actualización
      this.articuloService.updateArticulo(this.editandoId, {
        proveedor: this.formData.proveedor,
        nombre: this.formData.nombre
      }).subscribe({
        next: (res) => {
          this.mensaje = '✅ Artículo actualizado correctamente.';
          this.editandoId = null;
          this.limpiarCampos();
          this.cargarArticulos();
        },
        error: (err) => this.mensaje = '❌ Error al actualizar artículo.'
      });
    } else {
      // nuevo registro
      const data = {
        proveedor: this.formData.proveedor,
        nombre: this.formData.nombre
      };

      this.articuloService.createArticulo(data).subscribe({
        next: (res) => {
          this.mensaje = `✅ ${res.data.codigo} registrado exitosamente.`;
          this.registroExitoso = true;
          this.cargarCodigo();
          this.cargarArticulos();

          setTimeout(() => {
            this.mensaje = '';
            this.registroExitoso = false;
          }, 15000);
        },
        error: (err) => {
          console.error(err);
          this.mensaje = '❌ Error al registrar artículo.';
        }
      });
    }
  }

  limpiarCampos() {
    this.formData.proveedor = '';
    this.formData.nombre = '';
    if (!this.editandoId) this.cargarCodigo();
  }

  editarArticulo(art: any) {
    this.editandoId = art._id;
    this.formData.codigo = art.codigo;
    this.formData.proveedor = art.proveedor;
    this.formData.nombre = art.nombre;
  }

  eliminarArticulo(id: string) {
    if (confirm('¿Seguro que deseas eliminar este artículo?')) {
      this.articuloService.deleteArticulo(id).subscribe({
        next: () => {
          this.mensaje = '🗑️ Artículo eliminado.';
          this.cargarArticulos();
        },
        error: () => this.mensaje = '❌ Error al eliminar artículo.'
      });
    }
  }

  cambiarPagina(delta: number) {
    const nueva = this.page + delta;
    if (nueva >= 1 && nueva <= this.totalPages) {
      this.page = nueva;
      this.cargarArticulos();
    }
  }

  // Exportar a PDF
  exportarPDF() {
    this.articuloService.getAllArticulos().subscribe({
      next: (res: any[]) => {
        const doc = new jsPDF();

        // Título más grande y centrado
        doc.setFontSize(18);
        doc.text('Listado de Artículos', 105, 15, { align: 'center' });

        // Volver al tamaño normal
        doc.setFontSize(12);

        const rows = res.map(a => [
          a.codigo,
          a.proveedor,
          a.nombre,
          new Date(a.createdAt).toLocaleDateString(),
          new Date(a.updatedAt).toLocaleDateString()
        ]);

        autoTable(doc, {
          head: [['ID', 'Proveedor', 'Nombre', 'Fecha Creación', 'Fecha Modificación']],
          body: rows,
          startY: 25
        });

        doc.save('articulos.pdf');
      },
      error: (err) => console.error('Error al exportar PDF:', err)
    });
  }
}
