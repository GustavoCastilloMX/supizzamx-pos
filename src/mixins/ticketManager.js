import jsPDF from 'jspdf';
import image from '../services/logo';

export const ticketManager = {
  methods: {
    async imprimirTicket(item) {
      // Formato de ticket 80mm
      let doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [0, 0],
      });

      let font = doc.getFont().fontName;

      // Alto 63.9% de ancho
      doc.addImage(await image.logoBase64, 'png', 15, 3, 50, 31.95);
      let altura = 40;

      // Dirección
      doc.setFontSize(10);
      doc.setFont(font, 'bold');
      doc.text('Av. Quinceo 387 Granjas del Maestro', 40, altura, {
        align: 'center',
        maxWidth: 70,
      });
      altura += 5;

      // Ciudad
      doc.text('Morelia, Michoacán C.P. 58110', 40, altura, {
        align: 'center',
        maxWidth: 70,
      });
      altura += 6;

      // // Divisor
      // // doc.setLineDashPattern([7, 3, 1, 3], 10);
      // doc.setLineWidth(0.5);
      // doc.line(5, altura, 75, altura);
      // altura += 4;

      // Telefonos
      doc.setFontSize(9);
      doc.setFont(font, 'normal');
      doc.text(`443 351 54 66   443 312 80 50`, 40, altura, {
        align: 'center',
        maxWidth: 70,
      });
      altura += 5;

      // Datos fiscales
      doc.setFontSize(11);
      doc.setFont(font, 'bold');
      doc.text(`José Alberto Herrejón Reyna`, 40, altura, {
        align: 'center',
        maxWidth: 70,
      });
      altura += 5;

      doc.text(`RFC HERA860715QZ7`, 40, altura, {
        align: 'center',
        maxWidth: 70,
      });
      altura += 5;

      doc.setLineWidth(0.5);
      doc.line(5, altura, 75, altura);
      altura += 4;

      // Fecha
      doc.setFontSize(8);
      doc.text(`${this.getFechaTicket(item.fecha).toUpperCase()}`, 40, altura, {
        align: 'center',
        maxWidth: 70,
      });
      altura += 6;

      // Folio
      doc.setFontSize(14);
      doc.text(`SU ORDEN - ${this.getFolio(item._id)}`, 40, altura, {
        align: 'center',
        maxWidth: 70,
      });
      altura += 2;

      // Divisor
      // doc.setLineDashPattern([7, 3, 1, 3], 10);
      doc.setLineWidth(0.5);
      doc.line(5, altura, 75, altura);
      altura += 9;

      // let altoInicial = 40;
      doc.setFont(font, 'normal');
      doc.setFontSize(10);
      let pedido = [];
      let pizzas = [];

      if (item.pizzas.length > 0) {
        altura = this.imprimirPizzas(doc, altura, item.pizzas, font);
      }

      if (item.promos.length > 0) {
        altura = this.imprimirPromos(doc, altura, item.promos, font);
      }

      if (item.bebidas.length > 0) {
        altura = this.imprimirBebidasComplementos(
          doc,
          altura,
          item.bebidas,
          font
        );
        // pedido = await this.agregarPedido(pedido, item.bebidas, false);
      }
      if (item.complementos.length > 0) {
        altura = this.imprimirBebidasComplementos(
          doc,
          altura,
          item.complementos,
          font
        );
      }

      altura -= 3;
      doc.setLineDashPattern([], 10);
      doc.setLineWidth(0.5);
      doc.line(5, altura, 75, altura);
      altura += 9;

      doc.setFont(font, 'bold');
      doc.setFontSize(16);
      doc.text(
        `TOTAL ${new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
        }).format(item.total)}`,
        40,
        altura,
        { maxWidth: 70, align: 'center' }
      );

      altura += doc.getTextDimensions('T').h - 1;
      doc.line(5, altura, 75, altura);
      altura += 8;

      doc.setFontSize(13);
      let tipoPago = item.forma_pago;
      let mensaje = item.pagado
        ? `*Pago en ${tipoPago.toLowerCase()}`
        : item.forma_pago == 'Cortesia empleado'
        ? `*Cortesia empleado`
        : `*Pendiente de pago`;

      doc.text(`${mensaje}`, 40, altura, {
        maxWidth: 70,
        align: 'center',
      });
      altura += doc.getTextDimensions('P').h + 2;

      doc.text(`*Le atendio: ${item.cajero.nombres}`, 40, altura, {
        maxWidth: 70,
        align: 'center',
      });
      altura += doc.getTextDimensions('P').h + 4;

      doc.setFont(font, 'normal');
      doc.text(
        'supizza agradece su compra, vuelva pronto, consulta menú y promociones en',
        40,
        altura,
        {
          maxWidth: 70,
          align: 'center',
        }
      );
      altura +=
        doc.getTextDimensions(
          'supizza agradece su compra, vuelva pronto, consulta menú y promociones en',
          {
            fontSize: 13,
            maxWidth: 70,
          }
        ).h + 1;

      doc.setFont(font, 'bold');
      doc.setFontSize(14);
      doc.text('supizza.mx', 40, altura, {
        maxWidth: 70,
        align: 'center',
      });
      altura += 5;

      doc.setFont(font, 'bold');
      doc.setFontSize(9);
      doc.text('Este no es un compronante fiscal*', 40, altura, {
        maxWidth: 70,
        align: 'center',
      });
      altura += 5;

      doc.setLineDashPattern([2, 2, 1, 2], 1);
      doc.setLineWidth(0.2);
      doc.line(5, altura, 75, altura);
      altura += 2;

      doc.addImage(await image.qrBase64, 'jpg', 20, altura, 40, 40);
      altura += 48;

      // Folio
      doc.setFontSize(16);
      doc.text(`SU ORDEN - ${this.getFolio(item._id)}`, 5, altura, {
        maxWidth: 70,
      });
      altura += 10;

      //Nombre del cliente
      let nombreCliente = `${item.cliente.nombres} ${item.cliente.apellidos}`;
      doc.text(nombreCliente.toUpperCase(), 5, altura);
      altura += 6;

      doc.setFontSize(16);
      doc.text(item.cliente.telefono.toString(), 5, altura);
      altura += 6;

      doc.setFontSize(12);
      doc.setFont(font, 'bold');

      let direccion = `${item.direccion.calle} Int. ${item.direccion.numero_ext} Ext. ${item.direccion.numero_int}`;
      doc.text(`${item.direccion.calle}`, 5, altura, {
        maxWidth: 70,
        align: 'left',
      });
      altura += doc.getTextDimensions(`${item.direccion.calle}`).h + 0.5;

      doc.text(`Ext. ${item.direccion.numero_ext}`, 5, altura, {
        maxWidth: 70,
        align: 'left',
      });
      altura += doc.getTextDimensions(`I`).h + 0.5;

      doc.text(`Int. ${item.direccion.numero_int}`, 5, altura, {
        maxWidth: 70,
        align: 'left',
      });
      altura += doc.getTextDimensions(`I`).h + 0.5;

      doc.setFontSize(11);
      doc.setFont(font, 'normal');
      doc.text(`${item.direccion.referencia}`, 5, altura, {
        maxWidth: 70,
        align: 'left',
      });
      altura += doc.getTextDimensions(`${item.direccion.referencia}`, {
        maxWidth: 70,
      }).h;

      doc.setLineDashPattern([], 10);
      doc.setLineWidth(0.5);
      doc.line(5, altura, 75, altura);
      altura += 5;

      doc.setFont(font, 'bold');
      doc.text('Nota:', 5, altura);
      altura += 5;
      doc.setFont(font, 'normal');

      doc.text(item.nota, 5, altura, {
        maxWidth: 70,
        align: 'left',
      });

      altura += doc.getTextDimensions(item.nota, {
        maxWidth: 70,
      }).h;

      let altoFinal = altura * -1 - 10;
      doc.internal.pageSize.width = 80;
      doc.internal.pageSize.height = altoFinal;

      // doc.autoPrint();
      doc.output('dataurlnewwindow', {
        filename: `pedido-${this.getFolio(item._id)}.pdf`,
      });
    },
    obtenerIngredientes(ingredientes) {
      let message = '';
      let maximo = ingredientes.length - 1;

      ingredientes.forEach((e, index) => {
        if (index < maximo) message += e.nombre + ', ';
        if (index == maximo) message += e.nombre;
      });
      return message;
    },
    imprimirBebidasComplementos(doc, altura, items, font) {
      items.forEach((e) => {
        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 6;

        doc.setFont(font, 'bold');
        doc.setFontSize(11);
        doc.text(`${e.cantidad}`, 5, altura);

        doc.text(`${e.nombre.toUpperCase()}`, 12, altura);
        altura += doc.getTextDimensions(`${e.nombre}`).h - 0.5;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 8;

        let total = e.precio * e.cantidad;

        doc.setFontSize(12);
        doc.text(
          `${new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
          }).format(total)}`,
          75,
          altura,
          { maxWidth: 70, align: 'right' }
        );
        altura += 10;
      });
      return altura;
    },
    imprimirPizzas(doc, altura, items, font) {
      items.forEach((e) => {
        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 6;

        doc.setFont(font, 'bold');
        doc.setFontSize(11);
        doc.text(`${e.cantidad}`, 5, altura);

        let tamano =
          e.tamanos[0].nombre == 'Extra Grande'
            ? 'EX'
            : e.tamanos[0].nombre == 'Chica'
            ? 'CH'
            : e.tamanos[0].nombre.charAt(0);

        doc.text(`${e.nombre.toUpperCase()}`, 12, altura);
        doc.text(tamano, 70, altura, { maxWidth: 70, align: 'right' });
        altura += doc.getTextDimensions(`${e.nombre}`).h - 0.5;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 7;

        doc.setFont(font, 'normal');
        let ingredientes = this.obtenerIngredientes(e.ingredientes);
        doc.text(ingredientes, 12, altura, {
          maxWidth: 63,
        });
        altura += doc.getTextDimensions(ingredientes, {
          maxWidth: 63,
          fontSize: 12,
        }).h;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 8;

        let total = e.precio * e.cantidad;
        doc.setFont(font, 'bold');
        doc.setFontSize(12);
        doc.text(
          `${new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
          }).format(total)}`,
          70,
          altura,
          { maxWidth: 70, align: 'right' }
        );
        altura += 10;
      });
      return altura;
    },
    imprimirPizzasPromo(doc, altura, pizzas, font) {
      pizzas.forEach((e) => {
        let tamano =
          e.tamanos[0].nombre == 'Extra Grande'
            ? 'EX'
            : e.tamanos[0].nombre == 'Chica'
            ? 'CH'
            : e.tamanos[0].nombre.charAt(0);

        doc.setFont(font, 'normal');
        doc.text(`${e.nombre}`, 12, altura);
        doc.setFont(font, 'bold');
        doc.text(tamano, 70, altura, { maxWidth: 70, align: 'right' });
        altura += doc.getTextDimensions(`${e.nombre}`).h + 2;
      });
      return altura;
    },
    imprimirBebidasComplementosPromo(doc, altura, items, font) {
      doc.setFont(font, 'normal');
      items.forEach((e) => {
        doc.text(`${e.nombre}`, 12, altura);
        altura += doc.getTextDimensions(`${e.nombre}`).h + 2;
      });
      return altura;
    },
    imprimirPromos(doc, altura, items, font) {
      items.forEach((e) => {
        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 6;

        doc.setFont(font, 'bold');
        doc.setFontSize(11);
        doc.text(`${e.cantidad}`, 5, altura);

        doc.text(`${e.nombre.toUpperCase()}`, 12, altura);
        altura += doc.getTextDimensions(`${e.nombre}`).h - 0.5;

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 7;

        if (e.pizzas.length > 0)
          altura = this.imprimirPizzasPromo(doc, altura, e.pizzas, font);

        if (e.complementos.length > 0)
          altura = this.imprimirBebidasComplementosPromo(
            doc,
            altura,
            e.complementos,
            font
          );

        if (e.bebidas.length > 0)
          altura = this.imprimirBebidasComplementosPromo(
            doc,
            altura,
            e.bebidas,
            font
          );

        doc.setLineDashPattern([2, 2, 1, 2], 1);
        doc.setLineWidth(0.2);
        doc.line(12, altura, 75, altura);
        altura += 8;

        let total = e.precio * e.cantidad;
        doc.setFont(font, 'bold');
        doc.setFontSize(12);
        doc.text(
          `${new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
          }).format(total)}`,
          75,
          altura,
          { maxWidth: 70, align: 'right' }
        );
        altura += 10;
      });
      return altura;
    },
  },
};
