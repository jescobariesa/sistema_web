import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompraService } from '../../../../services/compra.service';

@Component({
  selector: 'app-achats',
  standalone: true,
  imports: [
      RouterModule,
      MatIconModule,
      CommonModule,
      FormsModule
    ],
  templateUrl: './achats.html',
  styleUrl: './achats.css'
})
export class AchatsComponent implements OnInit {

  // Campos del formulario
  formData = {
    no_factura: '',
    costo: null as number | null,
    cantidad: null as number | null,
    precio_venta: null as number | null,
  };

  // Listas y filtros
  proveedores: any[] = [];
  articulos: any[] = [];
  filtroProveedor = '';
  filtroArticulo = '';
  proveedorSeleccionado: any = null;
  articuloSeleccionado: any = null;

  // Compras registradas
  compras: any[] = [];
  mensaje = '';
  page = 1;
  totalPages = 1;

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private compraService: CompraService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarArticulos();
    this.cargarCompras();
  }

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  // ==========================
  cargarProveedores() {
    this.compraService.getProveedores().subscribe({
      next: (res: any) => {
        this.proveedores = Array.isArray(res) ? res : res.data;
      },
      error: (err) => console.error('Error cargando proveedores:', err)
    });
  }

  cargarArticulos() {
    this.compraService.getArticulos().subscribe({
      next: (res: any) => {
        this.articulos = Array.isArray(res) ? res : res.data;
      },
      error: (err) => console.error('Error cargando artículos:', err)
    });
  }

  cargarCompras() {
    this.compraService.getCompras(this.page, 10).subscribe({
      next: (res) => {
        this.compras = res.data;
        this.totalPages = res.pagination.totalPages;
      },
      error: (err) => console.error('Error al cargar compras:', err)
    });
  }

  // ==========================
  get proveedoresFiltrados() {
    return this.proveedores.filter(p =>
      (p.nombre || '').toLowerCase().includes(this.filtroProveedor.toLowerCase()) ||
      (p.codigo || '').toLowerCase().includes(this.filtroProveedor.toLowerCase())
    );
  }

  get articulosFiltrados() {
    return this.articulos.filter(a =>
      (a.nombre || '').toLowerCase().includes(this.filtroArticulo.toLowerCase()) ||
      (a.codigo || '').toLowerCase().includes(this.filtroArticulo.toLowerCase())
    );
  }

  seleccionarProveedor(p: any) {
    this.proveedorSeleccionado = p;
  }

  seleccionarArticulo(a: any) {
    this.articuloSeleccionado = a;
  }

  // ==========================
  limpiarCampos() {
    this.formData = { no_factura: '', costo: null, cantidad: null, precio_venta: null };
    this.filtroProveedor = '';
    this.filtroArticulo = '';
    this.proveedorSeleccionado = null;
    this.articuloSeleccionado = null;
  }

  get formularioValido(): boolean {
    return !!(
      this.formData.no_factura &&
      this.formData.costo &&
      this.formData.cantidad &&
      this.formData.precio_venta &&
      this.proveedorSeleccionado &&
      this.articuloSeleccionado
    );
  }

  // ==========================
  registrarCompra() {
    if (!this.formularioValido) {
      this.mensaje = '⚠️ Completa todos los campos y selecciona proveedor y artículo.';
      return;
    }

    const data = {
      proveedor: this.proveedorSeleccionado.codigo,
      articulo_codigo: this.articuloSeleccionado.codigo,
      articulo_nombre: this.articuloSeleccionado.nombre,
      no_factura: this.formData.no_factura,
      costo: this.formData.costo,
      cantidad: this.formData.cantidad,
      precio_venta: this.formData.precio_venta
    };

    this.compraService.createCompra(data).subscribe({
      next: () => {
        this.mensaje = '✅ Compra registrada correctamente.';
        this.cargarCompras();
        this.limpiarCampos();
        setTimeout(() => (this.mensaje = ''), 15000);
      },
      error: (err) => {
        console.error(err);
        this.mensaje = err.error?.msg || '❌ Error al registrar compra.';
      }
    });
  }

  eliminarCompra(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta compra? Esto revertirá el stock.')) {
      this.compraService.deleteCompra(id).subscribe({
        next: () => {
          this.mensaje = '🗑️ Compra eliminada y stock revertido.';
          this.cargarCompras();
        },
        error: () => (this.mensaje = '❌ Error al eliminar compra.')
      });
    }
  }

  cambiarPagina(delta: number) {
    const nueva = this.page + delta;
    if (nueva >= 1 && nueva <= this.totalPages) {
      this.page = nueva;
      this.cargarCompras();
    }
  }

}
