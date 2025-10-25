import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../../../services/venta.service';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
      RouterModule,
      MatIconModule,
      CommonModule,
      FormsModule
    ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent implements OnInit {

  formData = {
    cantidad: null as number | null,
    precio_venta: null as number | null,
    total: null as number | null
  };

  clientes: any[] = [];
  articulos: any[] = [];
  ventas: any[] = [];

  filtroCliente = '';
  filtroArticulo = '';

  clienteSeleccionado: any = null;
  articuloSeleccionado: any = null;

  mensaje = '';
  page = 1;
  totalPages = 1;

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private ventaService: VentaService,
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarArticulos();
    this.cargarVentas();
  }

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  get formularioValido() {
    return this.clienteSeleccionado &&
           this.articuloSeleccionado &&
           this.formData.cantidad &&
           this.formData.total &&
           this.formData.cantidad > 0;
  }

  cargarClientes() {
    this.ventaService.getClientes().subscribe({
      next: (res: any) => this.clientes = res.data ?? res,
      error: (err) => console.error('Error cargando clientes:', err)
    });
  }

  cargarArticulos() {
    this.ventaService.getArticulos().subscribe({
      next: (res: any) => this.articulos = res.data ?? res,
      error: (err) => console.error('Error cargando artículos:', err)
    });
  }

  cargarVentas() {
    this.ventaService.getVentas(this.page, 10).subscribe({
      next: (res) => {
        this.ventas = res.data;
        this.totalPages = res.pagination.totalPages;
      },
      error: (err) => console.error('Error al cargar ventas:', err)
    });
  }

  get clientesFiltrados() {
    return this.clientes.filter(c =>
      (c.nombres + ' ' + c.apellidos).toLowerCase().includes(this.filtroCliente.toLowerCase()) ||
      c.codigo.toLowerCase().includes(this.filtroCliente.toLowerCase())
    );
  }

  get articulosFiltrados() {
    return this.articulos.filter(a =>
      a.nombre.toLowerCase().includes(this.filtroArticulo.toLowerCase()) ||
      a.codigo.toLowerCase().includes(this.filtroArticulo.toLowerCase())
    );
  }

  seleccionarCliente(c: any) {
    this.clienteSeleccionado = c;
  }

  seleccionarArticulo(a: any) {
    this.articuloSeleccionado = a;
    this.formData.precio_venta = a.precio_venta;
    this.calcularTotal();
  }

  calcularTotal() {
    if (this.formData.cantidad && this.formData.precio_venta) {
      this.formData.total = this.formData.cantidad * this.formData.precio_venta;
    } else {
      this.formData.total = null;
    }
  }

  registrarVenta() {
    if (!this.formularioValido) return;

    const data = {
      cliente: this.clienteSeleccionado.codigo,
      articulo_codigo: this.articuloSeleccionado.codigo,
      cantidad: this.formData.cantidad
    };

    this.ventaService.createVenta(data).subscribe({
      next: (res: any) => {
        this.mensaje = `✅ Venta registrada correctamente.`;
        this.cargarVentas();
        this.limpiarCampos();
        setTimeout(() => (this.mensaje = ''), 2000);
      },
      error: (err) => {
        this.mensaje = err.error?.msg || '❌ Error al registrar venta.';
        console.error(err);
      }
    });
  }

  limpiarCampos() {
    this.formData = { cantidad: null, precio_venta: null, total: null };
    this.filtroCliente = '';
    this.filtroArticulo = '';
    this.clienteSeleccionado = null;
    this.articuloSeleccionado = null;
  }

  eliminarVenta(id: string) {
    if (confirm('¿Seguro que deseas eliminar esta venta? Esto revertirá el stock.')) {
      this.ventaService.deleteVenta(id).subscribe({
        next: () => {
          this.mensaje = '🗑️ Venta eliminada correctamente.';
          this.cargarVentas();
        },
        error: () => this.mensaje = '❌ Error al eliminar venta.'
      });
    }
  }

  cambiarPagina(delta: number) {
    const nueva = this.page + delta;
    if (nueva >= 1 && nueva <= this.totalPages) {
      this.page = nueva;
      this.cargarVentas();
    }
  }

}
