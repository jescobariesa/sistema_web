import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from '../../../../services/session.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterModule,MatIconModule,HttpClientModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css'
})
export class ReportesComponent {

  // Inyectamos varios servicios en un constructor para no alterar el funcionamiento
  constructor(
    private sessionService: SessionService,
    private router: Router,
    private http: HttpClient
  ) {}

onLogout() {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

generarReporte(tipo: string) {
    const url = `http://localhost:4000/api/reportes/${tipo}`;
    this.http.get<any>(url).subscribe({
      next: (res) => {
        const data = res.data;
        if (!data || data.length === 0) {
          alert('No hay datos para generar el reporte.');
          return;
        }

        // Crear documento PDF
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text(`Reporte de ${tipo.toUpperCase()}`, 14, 15);

        // Configurar columnas dinámicas según el tipo
        let columnas: string[] = [];
        let filas: any[] = [];

        switch (tipo) {
          case 'proveedores':
            columnas = ['Código', 'Nombre', 'Dirección', 'Contacto', 'Correo', 'Teléfono', 'Fecha creación'];
            filas = data.map((p: any) => [
              p.codigo, p.nombre, p.direccion, p.contacto, p.correo, p.telefono, new Date(p.createdAt).toLocaleString()
            ]);
            break;

          case 'compras':
            columnas = ['Fecha compra', 'Artículo', 'Proveedor', 'Factura', 'Costo', 'Cantidad', 'Precio venta'];
            filas = data.map((c: any) => [
              new Date(c.fecha_compra).toLocaleString(), c.articulo_nombre, c.proveedor,
              c.no_factura, c.costo, c.cantidad, c.precio_venta
            ]);
            break;

          case 'ventas':
            columnas = ['Fecha', 'Cliente', 'Artículo', 'Cantidad', 'Precio venta', 'Total'];
            filas = data.map((v: any) => [
              new Date(v.fecha).toLocaleString(), v.cliente, v.articulo_nombre, v.cantidad, v.precio_venta, v.total
            ]);
            break;

          case 'clientes':
            columnas = ['Código', 'Nombres', 'Apellidos', 'DPI', 'NIT', 'Fecha creación'];
            filas = data.map((c: any) => [
              c.codigo, c.nombres, c.apellidos, c.dpi, c.nit, new Date(c.fecha_creacion).toLocaleString()
            ]);
            break;

          case 'stock':
            columnas = ['Código artículo', 'Nombre', 'Cantidad', 'Precio costo', 'Precio venta', 'Fecha creación'];
            filas = data.map((s: any) => [
              s.codigo_articulo, s.nombre, s.cantidad, s.precio_costo, s.precio_venta, new Date(s.createdAt).toLocaleString()
            ]);
            break;
        }

        // Generar la tabla
        autoTable(doc, {
          head: [columnas],
          body: filas,
          startY: 25,
          theme: 'grid'
        });

        // Descargar el PDF
        doc.save(`reporte_${tipo}.pdf`);
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al generar el reporte.');
      }
    });
  }

}
